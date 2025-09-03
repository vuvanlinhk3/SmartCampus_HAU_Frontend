import React, { useState, useMemo } from 'react';
import { Search, Clock } from 'lucide-react';
import { DeviceCard } from '../components/Devices/DeviceCard';
import { DeviceDetailModal } from '../components/Devices/DeviceDetailModal';
import { Device, DeviceType, DeviceStatus } from '../types/device';
import { mockDevices, floors, getRoomsByFloor } from '../data/mockDevices';

function DeviceManagementPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const handleUpdateStatus = (deviceId: string, status: DeviceStatus) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        // Ensure we're only setting valid device statuses
        const validStatus = status === 'all' ? 'inactive' : status;
        return { ...device, status: validStatus };
      }
      return device;
    }));
  };

  // Filter devices based on criteria
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      // Search term filter
      if (searchTerm && !device.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Floor filter
      if (selectedFloor !== 'All') {
        const floorNum = selectedFloor === 'Tầng trệt' ? 0 : parseInt(selectedFloor.replace('Tầng ', ''));
        if (device.floor !== floorNum) {
          return false;
        }
      }

      // Room filter
      if (selectedRoom !== 'All' && device.room !== selectedRoom) {
        return false;
      }

      // Type filter
      if (selectedType !== 'All') {
        const typeMap: { [key: string]: string } = {
          'Đèn chiếu sáng': 'light',
          'Máy lạnh': 'ac',
          'Camera giám sát': 'camera',
          'Cảm biến': 'sensor',
          'Máy chiếu': 'projector',
          'Loa thông báo': 'speaker',
        };
        if (device.type !== typeMap[selectedType]) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'All') {
        const statusMap: { [key: string]: string } = {
          'Đang hoạt động': 'active',
          'Đang tắt': 'inactive',
          'Lỗi': 'error',
          'Đang bảo trì': 'maintenance',
        };
        if (device.status !== statusMap[selectedStatus]) {
          return false;
        }
      }

      return true;
    });
  }, [devices, searchTerm, selectedFloor, selectedRoom, selectedType, selectedStatus]);

  // Group devices by floor and room
  const groupedDevices = useMemo(() => {
    const groups: { [key: string]: { [key: string]: Device[] } } = {};
    
    filteredDevices.forEach((device) => {
      const floorKey = device.floor === 0 ? 'Tầng trệt' : `Tầng ${device.floor}`;
      if (!groups[floorKey]) {
        groups[floorKey] = {};
      }
      if (!groups[floorKey][device.room]) {
        groups[floorKey][device.room] = [];
      }
      groups[floorKey][device.room].push(device);
    });
    
    return groups;
  }, [filteredDevices]);

  const handleToggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newStatus = device.status === 'active' ? 'inactive' : 'active';
        return {
          ...device,
          status: newStatus,
          lastData: newStatus === 'active' ? device.lastData || 'Đang hoạt động' : 'Tắt',
          powerConsumption: newStatus === 'active' ? device.powerConsumption : 0,
        };
      }
      return device;
    }));
  };

  const handleMarkForMaintenance = (deviceId: string, note: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newMaintenanceRecord = {
          id: `maintenance-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'repair' as const,
          technician: 'Đang phân công',
          description: note,
          status: 'scheduled' as const,
        };

        const newActivityLog = {
          id: `activity-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Đánh dấu cần bảo trì',
          user: 'Quản trị viên',
          details: note,
        };

        return {
          ...device,
          status: 'maintenance' as const,
          lastData: 'Đang chờ bảo trì',
          maintenanceHistory: [newMaintenanceRecord, ...device.maintenanceHistory],
          activityLog: [newActivityLog, ...device.activityLog],
        };
      }
      return device;
    }));
  };

  // Get available rooms based on selected floor
  const availableRooms = useMemo(() => {
    if (selectedFloor === 'All') {
      const allRooms = devices.map(device => device.room);
      return [...new Set(allRooms)].sort();
    }
    const floorNum = selectedFloor === 'Tầng trệt' ? 0 : parseInt(selectedFloor.replace('Tầng ', ''));
    return getRoomsByFloor(floorNum);
  }, [selectedFloor, devices]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Quản lý thiết bị</h1>
              <p className="text-blue-100 text-sm">Tòa M - HAU</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-3">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          {/* Search */}
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

          {/* Filter Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chọn tầng:</label>
              <select
                value={selectedFloor}
                onChange={(e) => {
                  setSelectedFloor(e.target.value);
                  setSelectedRoom('All');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="Tầng trệt">Tầng trệt</option>
                <option value="Tầng 1">Tầng 1</option>
                <option value="Tầng 2">Tầng 2</option>
                <option value="Tầng 3">Tầng 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All</option>
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
                <option value="All">All</option>
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
                <option value="All">All</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Đang tắt">Đang tắt</option>
                <option value="Lỗi">Lỗi</option>
                <option value="Đang bảo trì">Đang bảo trì</option>
              </select>
            </div>
          </div>
        </div>

        {/* Device Groups */}
        {Object.keys(groupedDevices).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thiết bị</h3>
            <p className="text-gray-600">Thử điều chỉnh bộ lọc để xem thêm thiết bị</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedDevices).map(([floor, rooms]) => (
              <div key={floor}>
                {/* Floor Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thiết bị hành lang {floor.toLowerCase()}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {Object.values(rooms).flat().length} thiết bị
                  </span>
                </div>

                {/* Rooms in Floor */}
                {Object.entries(rooms).map(([room, roomDevices]) => (
                  <div key={`${floor}-${room}`} className="mb-8">
                    {/* Room Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                        {room}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{roomDevices.length} thiết bị</span>
                        <button className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">
                          Xem chi tiết phòng
                        </button>
                      </div>
                    </div>

                    {/* Device Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roomDevices.map((device) => (
                        <DeviceCard
                          key={device.id}
                          device={device}
                          onToggle={handleToggleDevice}
                          onViewDetails={setSelectedDevice}
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

      {/* Device Detail Modal */}
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