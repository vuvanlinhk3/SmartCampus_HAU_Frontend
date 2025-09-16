// src/pages/DeviceManagementPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { DeviceCard } from '../components/Devices/DeviceCard';
import { DeviceDetailModal } from '../components/Devices/DeviceDetailModal';
import { Unit, RoomWithUnits, getAllRoomsWithUnits, updateUnit } from '../utils/apiUnits';
import { Device, DeviceStatus } from '../types/index';

function DeviceManagementPage() {
  const [rooms, setRooms] = useState<RoomWithUnits[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roomsData = await getAllRoomsWithUnits();
        setRooms(roomsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch devices. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Robust floor parser:
  // - "Tầng trệt" -> 0
  // - "Tầng 5" -> 5
  // - "M301"  -> 3  (301 -> floor = 3)
  // - "1001"  -> 10 (1001 -> floor = 10)
  const parseFloorFromRoomName = (roomName: string): number => {
    if (!roomName) return 0;
    const lower = roomName.toLowerCase();
    if (lower.includes('tầng trệt')) return 0;

    // Direct "Tầng N" pattern
    const floorMatch = roomName.match(/Tầng\s*(\d{1,2})/i);
    if (floorMatch) {
      const n = parseInt(floorMatch[1], 10);
      if (!isNaN(n)) return n;
    }

    // Find first numeric sequence
    const digitsMatch = roomName.match(/\d+/);
    if (!digitsMatch) return 0;
    const numStr = digitsMatch[0];

    // If length >= 3, assume last two digits are room number, prefix is floor
    // e.g. 301 -> '3', 1001 -> '10'
    if (numStr.length >= 3) {
      const floorStr = numStr.slice(0, numStr.length - 2);
      const floorNum = parseInt(floorStr, 10);
      if (!isNaN(floorNum)) return floorNum;
    }

    // fallback: use the whole number
    const fallback = parseInt(numStr, 10);
    return isNaN(fallback) ? 0 : fallback;
  };

  // Map Unit to Device
  const mapUnitToDevice = (unit: Unit, roomName: string): Device => {
    const isInMaintenance = !unit.status;
    return {
      id: unit.unitId.toString(),
      code: unit.deviceCode,
      name: unit.deviceType,
      type: unit.deviceType,
      status: isInMaintenance ? 'maintenance' : 'active',
      room: roomName,
      floor: parseFloorFromRoomName(roomName),
      lastData: unit.detail || (unit.status ? 'Đang hoạt động' : 'Đang bảo trì'),
      powerConsumption: unit.status ? 100 : 0,
      installDate: new Date().toISOString(),
      maintenanceHistory: [],
      activityLog: [],
    };
  };

  // Convert list of rooms -> flat devices
  const devices = useMemo(() => {
    return rooms.flatMap(room => room.units.map(unit => mapUnitToDevice(unit, room.roomName)));
  }, [rooms]);

  // Floors available: unique numeric floors, sorted ascending.
  // As requested: show floors from 3 to 20 (inclusive).
  const floors = useMemo(() => {
    const floorNumbers = rooms.map(r => parseFloorFromRoomName(r.roomName));
    const unique = Array.from(new Set(floorNumbers));
    const filtered = unique.filter(n => n >= 3 && n <= 20);
    filtered.sort((a, b) => a - b);
    return filtered; // array of numbers
  }, [rooms]);

  const handleUpdateStatus = async (deviceId: string, status: DeviceStatus) => {
    try {
      let unitToUpdate: Unit | null = null;
      let roomId: number | null = null;

      for (const room of rooms) {
        const unit = room.units.find(u => u.unitId.toString() === deviceId);
        if (unit) {
          unitToUpdate = unit;
          roomId = room.roomId;
          break;
        }
      }

      if (!unitToUpdate || roomId === null) return;

      if (status === 'active' || status === 'maintenance') {
        await updateUnit(unitToUpdate.unitId, {
          unitId: unitToUpdate.unitId,
          roomId: roomId,
          deviceType: unitToUpdate.deviceType,
          deviceCode: unitToUpdate.deviceCode,
          status: status === 'active',
          detail: status === 'active' ? 'Đang hoạt động' : 'Đang bảo trì'
        });
      }

      setRooms(prev => prev.map(room => ({
        ...room,
        units: room.units.map(unit => {
          if (unit.unitId.toString() === deviceId) {
            return {
              ...unit,
              status: status === 'active',
              detail: status === 'active' ? 'Đang hoạt động' : 'Đang bảo trì'
            };
          }
          return unit;
        }),
      })));
    } catch (error) {
      console.error('Error updating device status:', error);
      setError('Failed to update device status.');
    }
  };

  // Filters
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      if (searchTerm && !device.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      if (selectedFloor !== 'All') {
        const floorNum = selectedFloor === 'Tầng trệt' ? 0 : parseInt(selectedFloor.replace('Tầng ', ''));
        if (device.floor !== floorNum) return false;
      }

      if (selectedRoom !== 'All' && device.room !== selectedRoom) return false;

      if (selectedType !== 'All') {
        const typeMap: { [key: string]: string[] } = {
          'Đèn chiếu sáng': ['Bóng đèn'],
          'Máy lạnh': ['Điều hòa','Điều hòa 1', 'Điều hòa 2', 'Điều hòa 3', 'Điều hòa 4'],
          'Camera giám sát': ['camera'],
          'Cảm biến': ['Cảm biến'],
          'Máy chiếu': ['Máy chiếu', 'Ti Vi'],
          'Loa thông báo': ['speaker'],
        };
        const allowedTypes = typeMap[selectedType] || [];
        if (!allowedTypes.includes(device.type)) return false;
      }

      if (selectedStatus !== 'All') {
        const statusMap: { [key: string]: string } = {
          'Đang hoạt động': 'active',
          'Đang tắt': 'inactive',
          'Lỗi': 'error',
          'Đang bảo trì': 'maintenance',
        };
        if (device.status !== statusMap[selectedStatus]) return false;
      }

      return true;
    });
  }, [devices, searchTerm, selectedFloor, selectedRoom, selectedType, selectedStatus]);

  // Group devices by floorKey -> roomName -> devices
  const groupedDevices = useMemo(() => {
    const groups: { [floorKey: string]: { [roomName: string]: Device[] } } = {};
    filteredDevices.forEach(device => {
      const floorKey = device.floor === 0 ? 'Tầng trệt' : `Tầng ${device.floor}`;
      if (!groups[floorKey]) groups[floorKey] = {};
      if (!groups[floorKey][device.room]) groups[floorKey][device.room] = [];
      groups[floorKey][device.room].push(device);
    });
    return groups;
  }, [filteredDevices]);

  // Create ordered entries of groupedDevices sorted by numeric floor asc, and restrict to floors 3..20
  const orderedGroupEntries = useMemo(() => {
    const entries = Object.entries(groupedDevices);
    entries.sort((a, b) => {
      const fa = a[0] === 'Tầng trệt' ? 0 : parseInt(a[0].replace('Tầng ', ''), 10) || 0;
      const fb = b[0] === 'Tầng trệt' ? 0 : parseInt(b[0].replace('Tầng ', ''), 10) || 0;
      return fa - fb;
    });
    // keep only floors 3..20
    return entries.filter(([floorKey]) => {
      const num = floorKey === 'Tầng trệt' ? 0 : parseInt(floorKey.replace('Tầng ', ''), 10) || 0;
      return num >= 3 && num <= 20;
    });
  }, [groupedDevices]);

  const handleToggleDevice = (deviceId: string) => {
    setRooms(prev => prev.map(room => ({
      ...room,
      units: room.units.map(unit => {
        if (unit.unitId.toString() === deviceId) {
          if (!unit.status) return unit; // don't toggle if in maintenance
          const isCurrentlyOn = unit.detail === 'Đang hoạt động';
          return { ...unit, detail: isCurrentlyOn ? 'Tắt' : 'Đang hoạt động' };
        }
        return unit;
      }),
    })));
  };

  const handleMarkForMaintenance = async (deviceId: string, note: string) => {
    try {
      let unitToUpdate: Unit | null = null;
      let roomId: number | null = null;
      for (const room of rooms) {
        const unit = room.units.find(u => u.unitId.toString() === deviceId);
        if (unit) {
          unitToUpdate = unit;
          roomId = room.roomId;
          break;
        }
      }
      if (!unitToUpdate || roomId === null) return;

      await updateUnit(unitToUpdate.unitId, {
        unitId: unitToUpdate.unitId,
        roomId,
        deviceType: unitToUpdate.deviceType,
        deviceCode: unitToUpdate.deviceCode,
        status: false,
        detail: note || 'Đang bảo trì'
      });

      setRooms(prev => prev.map(room => ({
        ...room,
        units: room.units.map(unit => {
          if (unit.unitId.toString() === deviceId) {
            return { ...unit, status: false, detail: note || 'Đang bảo trì' };
          }
          return unit;
        }),
      })));
    } catch (error) {
      console.error('Error marking device for maintenance:', error);
      setError('Failed to mark device for maintenance.');
    }
  };

  const availableRooms = useMemo(() => {
    if (selectedFloor === 'All') {
      const allRooms = rooms.map(room => room.roomName);
      return [...new Set(allRooms)].sort();
    }
    const floorNum = selectedFloor === 'Tầng trệt' ? 0 : parseInt(selectedFloor.replace('Tầng ', ''));
    return rooms
      .filter(room => parseFloorFromRoomName(room.roomName) === floorNum)
      .map(room => room.roomName)
      .sort();
  }, [selectedFloor, rooms]);

  if (loading) return <div className="text-center py-12">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Quản lý thiết bị</h1>
              <p className="text-blue-100 mt-1">Tòa M - HAU</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nhập để tìm kiếm Thiết bị"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chọn tầng:</label>
              <select
                value={selectedFloor}
                onChange={(e) => { setSelectedFloor(e.target.value); setSelectedRoom('All'); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">Tất cả</option>
                {floors.map(floor => (
                  <option key={floor} value={floor === 0 ? 'Tầng trệt' : `Tầng ${floor}`}>
                    {floor === 0 ? 'Tầng trệt' : `Tầng ${floor}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">Tất cả</option>
                {availableRooms.map((room) => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại thiết bị</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">Tất cả</option>
                <option value="Đèn chiếu sáng">Đèn chiếu sáng</option>
                <option value="Máy lạnh">Máy lạnh</option>
                <option value="Camera giám sát">Camera giám sát</option>
                <option value="Cảm biến">Cảm biến</option>
                <option value="Máy chiếu">Máy chiếu</option>
                <option value="Loa thông báo">Loa thông báo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">Tất cả</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Đang tắt">Đang tắt</option>
                <option value="Đang bảo trì">Đang bảo trì</option>
              </select>
            </div>
          </div>
        </div>

        {orderedGroupEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thiết bị</h3>
            <p className="text-gray-600">Thử điều chỉnh bộ lọc để xem thêm thiết bị</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orderedGroupEntries.map(([floor, roomsByName]) => (
              <div key={floor}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Tổng Thiết bị</h2>
                  <span className="text-sm text-gray-500">{Object.values(roomsByName).flat().length} thiết bị</span>
                </div>

                {Object.entries(roomsByName).map(([roomName, roomDevices]) => (
                  <div key={`${floor}-${roomName}`} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">{roomName}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{roomDevices.length} thiết bị</span>
                        <button className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">Xem chi tiết phòng</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roomDevices.map(device => (
                        <DeviceCard
                          key={device.id}
                          device={device}
                          onToggle={handleToggleDevice}
                          onViewDetails={(d) => setSelectedDevice(d)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          isOpen={!!selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onMarkForMaintenance={handleMarkForMaintenance}
          onToggleDevice={handleToggleDevice}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}

export default DeviceManagementPage;
