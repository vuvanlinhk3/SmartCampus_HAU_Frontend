import React, { useState, useEffect } from 'react';
import Header from '../components/Statistics/Header';
import AlertBanner from '../components/Statistics/AlertBanner';
import Filters from '../components/Statistics/Filters';
import StatCards from '../components/Statistics/StatCards';
import Charts from '../components/Statistics/Charts';
import EquipmentTable from '../components/Statistics/EquipmentTable';
import RoomTable from '../components/Statistics/RoomTable';
import ExportSection from '../components/Statistics/ExportSection';
import { FilterState, Room, Equipment, Alert } from '../types';
import { getAllRoomsWithUnits, RoomWithUnits } from '../utils/apiUnits';
import { getRoomDetail } from '../utils/apiDetailRoom';

function StatisticsPage() {
  const [filters, setFilters] = useState<FilterState>({
    timeRange: 'month',
    floor: 'all',
    roomType: 'all',
    roomStatus: 'all'
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Lấy dữ liệu từ API units
      const roomsWithUnits = await getAllRoomsWithUnits();
      
      // Chuyển đổi dữ liệu từ API sang định dạng Room và Equipment
      const convertedRooms: Room[] = [];
      const convertedEquipment: Equipment[] = [];
      const newAlerts: Alert[] = [];

      for (const roomData of roomsWithUnits) {
        try {
          // Lấy thông tin chi tiết phòng
          const roomDetail = await getRoomDetail(roomData.roomName);
          
          // Xác định loại phòng dựa trên roomType từ API
          let roomType: 'lecture_hall' | 'laboratory' | 'classroom' | 'meeting_room' | string = 'classroom';
          if (roomDetail.roomType) {
            const roomTypeLower = roomDetail.roomType.toLowerCase();
            if (roomTypeLower.includes('lecture')) roomType = 'lecture_hall';
            else if (roomTypeLower.includes('lab')) roomType = 'laboratory';
            else if (roomTypeLower.includes('meeting')) roomType = 'meeting_room';
            else roomType = roomDetail.roomType; // Giữ nguyên nếu không khớp
          }
          
          // Xác định trạng thái phòng
          let status: 'occupied' | 'vacant' | 'maintenance' = 'vacant';

          if (roomDetail.status === 'Đang học') status = 'occupied';
          else if (roomDetail.status === 'Trống') status = 'vacant';
          else if (roomDetail.status === 'Bảo trì') status = 'maintenance';
          
          // Chuyển đổi thành định dạng Room
          const room: Room = {
            id: roomData.roomId,
            name: roomData.roomName,
            floor: roomDetail.location || 1,
            type: roomType,
            status: status,
            capacity: roomDetail.capacity || 0,
            usageHours: 0 // Mặc định
          };
          
          convertedRooms.push(room);

          type EquipmentType = 'projector' | 'air_conditioner' | 'camera' | 'audio_system' | 'computer' | string;
          // Chuyển đổi units thành equipment
          for (const unit of roomData.units) {
            // Ánh xạ loại thiết bị
            let equipmentType: EquipmentType = unit.deviceType; // mặc định = deviceType gốc
            const deviceTypeLower = unit.deviceType.toLowerCase();

            if (deviceTypeLower.includes('máy chiếu') || deviceTypeLower.includes('projector') || deviceTypeLower.includes('Ti Vi')) {
              equipmentType = 'projector';
            } else if (
              deviceTypeLower.includes('máy lạnh') ||
              deviceTypeLower.includes('điều hòa') ||
              deviceTypeLower.includes('air conditioner')
            ) {
              equipmentType = 'air_conditioner';
            } else if (deviceTypeLower.includes('camera') || deviceTypeLower.includes('webcam')) {
              equipmentType = 'camera';
            } else if (
              deviceTypeLower.includes('âm thanh') ||
              deviceTypeLower.includes('loa') ||
              deviceTypeLower.includes('audio')
            ) {
              equipmentType = 'audio_system';
            } else if (
              deviceTypeLower.includes('máy tính') ||
              deviceTypeLower.includes('computer')
            ) {
              equipmentType = 'computer';
            }

            const equipmentItem: Equipment = {
              id: unit.unitId.toString(),
              name: unit.deviceType,
              type: equipmentType, // nếu không match -> giữ nguyên deviceType gốc
              status: unit.status ? 'working' : 'maintenance',
              room: roomData.roomName,
              installDate: new Date().toISOString().split('T')[0], // Mặc định
              lastCheck: new Date().toISOString().split('T')[0], // Mặc định
            };

            convertedEquipment.push(equipmentItem);

            // Tạo alert cho thiết bị bảo trì
            if (!unit.status) {
              newAlerts.push({
                id: `alert-${unit.unitId}`,
                title: `Thiết bị cần bảo trì`,
                type: 'warning',
                message: `Thiết bị ${unit.deviceType} trong phòng ${roomData.roomName} cần bảo trì`,
                timestamp: new Date().toISOString(),
              });
            }
          }

        } catch (err) {
          console.error(`Error processing room ${roomData.roomName}:`, err);
        }
      }

      setRooms(convertedRooms);
      setEquipment(convertedEquipment);
      setAlerts(newAlerts);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to data
  const filteredRooms = rooms.filter(room => {
    const floorMatch = filters.floor === 'all' || room.floor === parseInt(filters.floor);
    const typeMatch = filters.roomType === 'all' || room.type === filters.roomType;
    const statusMatch = filters.roomStatus === 'all' || room.status === filters.roomStatus;
    
    return floorMatch && typeMatch && statusMatch;
  });

  const filteredEquipment = equipment.filter(eq => {
    const roomInFilteredRooms = filteredRooms.some(room => room.name === eq.room);
    return filters.floor === 'all' || roomInFilteredRooms;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-medium mb-2">Lỗi khi tải dữ liệu</div>
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AlertBanner alerts={alerts} />
      
      <div className="mx-auto px-6 py-8">
        <Filters filters={filters} onFiltersChange={setFilters} />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div key={item} className="bg-gray-100 rounded-lg p-6 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <StatCards rooms={filteredRooms} equipment={filteredEquipment} />
            <Charts equipment={filteredEquipment} />
            <EquipmentTable equipment={filteredEquipment} />
            <RoomTable rooms={filteredRooms} />
            <ExportSection rooms={filteredRooms} equipment={filteredEquipment} />
          </>
        )}
      </div>
    </div>
  );
}

export default StatisticsPage;