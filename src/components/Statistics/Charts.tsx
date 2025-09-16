import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, PieChart, Calendar } from 'lucide-react';
import { Equipment } from '../../types';
import { Room } from '../../types';
import { getAllBookingsForStatistics, BookingStatistic } from '../../utils/allbookingapi';

interface ChartsProps {
  equipment: Equipment[];
  rooms?: Room[];
}

const Charts: React.FC<ChartsProps> = ({ equipment, rooms = [] }) => {
  const [weeklyBookings, setWeeklyBookings] = useState<number>(0);
  const [bookingDetails, setBookingDetails] = useState<BookingStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyBookings = async () => {
      try {
        setIsLoading(true);
        
        // Lấy tất cả booking từ API mới
        const allBookings: BookingStatistic[] = await getAllBookingsForStatistics();
        
        // Lọc các booking trong tuần hiện tại
        const currentWeekBookings = allBookings.filter(booking => {
          const bookingDate = new Date(booking.bookingDate);
          const today = new Date();
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          
          return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
        });

        setWeeklyBookings(currentWeekBookings.length);
        setBookingDetails(currentWeekBookings);
      } catch (err) {
        console.error('Error fetching weekly bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyBookings();
  }, []);

  // Equipment status for pie chart
  const workingCount = equipment.filter(eq => eq.status === 'working').length;
  const maintenanceCount = equipment.filter(eq => eq.status === 'maintenance').length;
  const brokenCount = equipment.filter(eq => eq.status === 'broken').length;

  const equipmentData = [
    { label: 'Hoạt động bình thường', value: workingCount, color: 'bg-green-500' },
    { label: 'Đang bảo trì', value: maintenanceCount, color: 'bg-amber-500' },
    { label: 'Hỏng', value: brokenCount, color: 'bg-red-500' }
  ];

  // Tính toán thống kê theo ngày trong tuần
  const getDayStats = () => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const dayStats = days.map(day => ({ day, count: 0 }));
    
    bookingDetails.forEach(booking => {
      const bookingDate = new Date(booking.bookingDate);
      const dayOfWeek = bookingDate.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
      
      // Chuyển đổi sang index của mảng days (0 = Thứ 2, 6 = Chủ nhật)
      const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      dayStats[index].count++;
    });
    
    return dayStats;
  };

  const dayStats = getDayStats();
  const maxDayCount = dayStats.length > 0 ? Math.max(...dayStats.map(day => day.count)) : 0;

  // Nếu không có dữ liệu
  if (equipment.length === 0 && rooms.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center mb-8">
        <div className="text-gray-500 text-lg">Không có dữ liệu biểu đồ</div>
        <p className="text-gray-400 mt-2">Không tìm thấy dữ liệu phòng học hoặc thiết bị</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      {/* Weekly Bookings Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Thống kê đặt phòng theo tuần</h3>
        </div>
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{weeklyBookings}</p>
              <p className="text-gray-600">lượt đặt phòng trong tuần</p>
              <p className="text-sm text-gray-500 mt-2">
                {rooms.length > 0 ? `Trung bình ${(weeklyBookings / rooms.length).toFixed(1)} lượt đặt/phòng` : ''}
              </p>
            </div>
            
            {/* Biểu đồ chi tiết theo ngày */}
            {weeklyBookings > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Chi tiết theo ngày:</h4>
                <div className="space-y-3">
                  {dayStats.map((day, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600 w-16">
                        {day.day}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: maxDayCount > 0 ? `${(day.count / maxDayCount) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8">
                        {day.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Equipment Status Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <PieChart className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Tình trạng thiết bị</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {equipmentData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
            
            {equipment.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Tỷ lệ phần trăm</div>
                <div className="flex space-x-1 h-6 rounded-full overflow-hidden">
                  {equipmentData.map((item, index) => (
                    <div
                      key={index}
                      className={`${item.color} transition-all duration-500`}
                      style={{ 
                        width: `${(item.value / equipment.length) * 100}%`,
                        minWidth: '4px'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {equipment.length > 0 && (
            <div className="flex items-center justify-center">
              <div className="relative" style={{ width: '200px', height: '200px' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {(() => {
                    let startAngle = 0;

                    return equipmentData.map((item, index) => {
                      const percentage = (item.value / equipment.length) * 100;
                      const angle = (percentage / 100) * 360;

                      const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                      const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

                      const largeArcFlag = angle > 180 ? 1 : 0;

                      const path = (
                        <path
                          key={index}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={
                            item.color === "bg-green-500"
                              ? "#10B981"
                              : item.color === "bg-amber-500"
                              ? "#F59E0B"
                              : "#EF4444"
                          }
                        />
                      );

                      startAngle += angle;
                      return path;
                    });
                  })()}

                  <circle cx="50" cy="50" r="30" fill="white" />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Tổng: {equipment.length}
                  </text>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;