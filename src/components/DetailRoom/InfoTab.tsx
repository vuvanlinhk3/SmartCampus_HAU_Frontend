import React, { useState, useEffect } from 'react';
import { Settings, Activity, Calendar, Zap, AlertTriangle } from 'lucide-react';
import { RoomDetail, getBookingsByRoomId } from '../../utils/apiDetailRoom';
import { calculateDeviceStats, getAllRoomsWithUnits } from '../../utils/apiUnits';

interface InfoTabProps {
  roomData: RoomDetail;
}

const InfoTab: React.FC<InfoTabProps> = ({ roomData }) => {
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [deviceStats, setDeviceStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    maintenanceDevices: 0
  });

  // Map room type to Vietnamese
  const roomTypeMap: Record<string, string> = {
    'hoc': 'Phòng học lý thuyết',
    've': 'Phòng vẽ',
    'may': 'Phòng máy tính',
    'vanphongkhoacntt': 'Văn phòng khoa CNTT',
    'Doc': 'Phòng học' // Default fallback
  };

  const roomType = roomTypeMap[roomData.roomType?.toLowerCase()] || 'Phòng học';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bookings data
        const bookingsData = await getBookingsByRoomId(roomData.roomId);
        setWeeklyTotal(bookingsData.weeklyTotal);

        // Fetch device data
        const rooms = await getAllRoomsWithUnits();
        const stats = calculateDeviceStats(rooms);
        
        // Tìm thống kê cho phòng hiện tại
        // Sửa lỗi TypeScript: chuyển đổi roomData.roomId sang number để so sánh
        const currentRoomStats = stats.roomsWithDevices.find(
          room => room.roomId === Number(roomData.roomId)
        );

        if (currentRoomStats) {
          setDeviceStats({
            totalDevices: currentRoomStats.totalDevices,
            activeDevices: currentRoomStats.activeDevices,
            maintenanceDevices: currentRoomStats.maintenanceDevices
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setWeeklyTotal(0);
      } finally {
        setLoading(false);
      }
    };

    if (roomData.roomId) {
      fetchData();
    }
  }, [roomData.roomId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Thông tin cơ bản</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tên phòng</label>
              <p className="font-medium text-gray-900">{roomData.roomName}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Loại phòng</label>
              <p className="text-gray-900">{roomType}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sức chứa</label>
              <p className="text-gray-900">{roomData.capacity || '50'} học viên</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Diện tích</label>
              <p className="text-gray-900">{roomData.area || '75'} m²</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Vị trí</label>
              <p className="text-gray-900">Tầng {roomData.location}, Tòa nhà {roomData.roomName[0]}, Cơ sở 1</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">Trạng thái hiện tại</h3>
            </div>
            <span className={`${
              roomData.status === 'Trống' ? 'bg-green-100 text-green-800' : 
              roomData.status === 'Đang học' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            } text-sm px-3 py-1 rounded-full`}>
              {roomData.status}
            </span>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Trạng thái phòng</label>
              <p className="text-gray-900">{roomData.status}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nhiệt độ</label>
              <p className="text-gray-900">24°C</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Độ ẩm</label>
              <p className="text-gray-900">65%</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Chất lượng không khí</label>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Tốt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : weeklyTotal}
          </p>
          <p className="text-sm text-gray-600">Lịch tuần này</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Settings className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : deviceStats.totalDevices}
          </p>
          <p className="text-sm text-gray-600">Tổng thiết bị</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : deviceStats.activeDevices}
          </p>
          <p className="text-sm text-gray-600">Đang hoạt động</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : deviceStats.maintenanceDevices}
          </p>
          <p className="text-sm text-gray-600">Bảo trì</p>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;