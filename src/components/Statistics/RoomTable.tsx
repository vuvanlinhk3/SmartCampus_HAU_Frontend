// src/components/Statistics/RoomTable.tsx
import React, { useState, useEffect } from 'react';
import { Search, Home } from 'lucide-react';
import { Room } from '../../types';
import { getAllBookingsForStatistics, BookingStatistic } from '../../utils/allbookingapi';

interface RoomTableProps {
  rooms: Room[];
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingStats, setBookingStats] = useState<BookingStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchBookingStatistics = async () => {
      try {
        const stats = await getAllBookingsForStatistics();
        setBookingStats(stats);
      } catch (error) {
        console.error('Error fetching booking statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStatistics();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'occupied': return 'Đang học';
      case 'vacant': return 'Trống';
      case 'maintenance': return 'Bảo trì';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'hoc': return 'Giảng đường';
      case 've': return 'Phòng Vẽ';
      case 'may': return 'Phòng Máy';
      case 'vanphongkhoacntt':
      case 'vanphongkhoa':
        return 'Văn Phòng Khoa';
      default: return type;
    }
  };

  // Calculate booking count for each room
  const getBookingCountForRoom = (roomId: string) => {
    if (loading) return 'Đang tải...';

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const count = bookingStats.filter(booking => {
      if (!booking || booking.roomId === undefined || booking.roomId === null) {
        return false;
      }

      const bookingRoomId = booking.roomId.toString();
      if (!booking.bookingDate) return false;

      try {
        const date = new Date(booking.bookingDate);
        return (
          bookingRoomId === roomId &&
          date.getFullYear() === currentYear &&
          date.getMonth() + 1 === currentMonth
        );
      } catch {
        return false;
      }
    }).length;

    return `${count} lịch/tháng`;
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floor.toString().includes(searchTerm)
  );

  const displayedRooms = showAll ? filteredRooms : filteredRooms.slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Home className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Chi tiết thống kê phòng học</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tầng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tần suất sử dụng
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedRooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Tầng {room.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {room.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getTypeText(room.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                    {getStatusText(room.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getBookingCountForRoom(room.id.toString())}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy phòng học nào phù hợp với tìm kiếm hiện tại.
        </div>
      )}

      {/* Nút xem thêm / thu gọn */}
      {filteredRooms.length > 10 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {showAll ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomTable;
