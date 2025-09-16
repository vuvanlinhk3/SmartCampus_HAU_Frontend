import React, { useState, useEffect } from 'react';
import { Plus, Clock, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import ScheduleModal from '../../models/ScheduleModal';
import { 
  RoomDetail, 
  Booking, 
  getBookingsByRoomId, 
  deleteBooking,
  updateBooking
} from '../../utils/apiDetailRoom';

interface ScheduleTabProps {
  roomData: RoomDetail;
  showScheduleModal: boolean;
  setShowScheduleModal: (show: boolean) => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ 
  roomData, 
  showScheduleModal, 
  setShowScheduleModal 
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Fetch bookings when component mounts or roomId changes
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookingData = await getBookingsByRoomId(roomData.roomId);
        setBookings(bookingData.allBookings);
        
        // Set selected date to today
        const today = new Date();
        const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        setSelectedDate(formattedToday);
      } catch (err) {
        setError('Không thể tải dữ liệu lịch đặt phòng');
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (roomData.roomId) {
      fetchBookings();
    }
  }, [roomData.roomId]);

  // Handle delete booking
  const handleDeleteBooking = async (bookingId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch đặt phòng này?')) {
      try {
        await deleteBooking(bookingId);
        // Refresh bookings after deletion
        const bookingData = await getBookingsByRoomId(roomData.roomId);
        setBookings(bookingData.allBookings);
      } catch (err) {
        setError('Không thể xóa lịch đặt phòng');
        console.error('Failed to delete booking:', err);
      }
    }
  };

  // Handle edit booking
  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowScheduleModal(true);
  };

  // Generate calendar days for the given month and year
  const getCalendarDays = (month: number, year: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const today = new Date();
    const calendarDays: { day: string | null; date: number | null; isToday?: boolean }[] = [];

    // Add day headers
    ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].forEach(day => {
      calendarDays.push({ day, date: null });
    });

    // Add empty slots for days before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push({ day: null, date: null });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        year === today.getFullYear() &&
        month === today.getMonth() + 1 &&
        i === today.getDate();
      calendarDays.push({ day: null, date: i, isToday });
    }

    return calendarDays;
  };

  const calendarDays = getCalendarDays(currentMonth, currentYear);

  // Month names for display
  const monthNames = [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ];

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 1 ? 12 : prev - 1));
    setCurrentYear(prev => (currentMonth === 1 ? prev - 1 : prev));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 12 ? 1 : prev + 1));
    setCurrentYear(prev => (currentMonth === 12 ? prev + 1 : prev));
  };

  // Handle date selection
  const handleDateSelect = (date: number | null) => {
    if (date) {
      const formattedDate = `${date.toString().padStart(2, '0')}/${currentMonth
        .toString()
        .padStart(2, '0')}/${currentYear}`;
      setSelectedDate(formattedDate);
    }
  };

  // Convert selectedDate to format compatible with bookingDate (YYYY-MM-DD)
  const convertToApiDateFormat = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/');
    const localDate = new Date(Number(year), Number(month) - 1, Number(day));
    return `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;
  };

  // Filter events for the selected date
  const selectedDateEvents = bookings.filter(booking => {
    const bookingDate = new Date(booking.bookingDate);
    const selectedDateFormatted = convertToApiDateFormat(selectedDate);
    const bookingDateFormatted = `${bookingDate.getFullYear()}-${(bookingDate.getMonth() + 1).toString().padStart(2, '0')}-${bookingDate.getDate().toString().padStart(2, '0')}`;
    return bookingDateFormatted === selectedDateFormatted;
  });

  // Determine currently active event (based on current time)
  const currentTime = new Date();
  const activeEvent = selectedDateEvents.find(booking => {
    if (!booking.timeRange) return false;
    
    const [startTime] = booking.timeRange.split(' - ');
    const [hours, minutes] = startTime.split(':').map(Number);
    
    const bookingDate = new Date(booking.bookingDate);
    bookingDate.setHours(hours, minutes, 0, 0);

    const eventStart = bookingDate;
    const eventEnd = new Date(eventStart.getTime() + booking.periods * 45 * 60 * 1000);
    
    return currentTime >= eventStart && currentTime <= eventEnd;
  });

  // Get upcoming events
  const upcomingEvents = selectedDateEvents.filter(booking => {
    if (!booking.timeRange) return false;
    
    const [startTime] = booking.timeRange.split(' - ');
    const [hours, minutes] = startTime.split(':').map(Number);
    const bookingDate = new Date(booking.bookingDate);
    bookingDate.setHours(hours, minutes, 0, 0);

    return !activeEvent || bookingDate > currentTime;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Lịch hoạt động phòng {roomData.roomName}</h2>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng ký lịch</span>
          </button>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải dữ liệu lịch...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Lịch hoạt động phòng {roomData.roomName}</h2>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng ký lịch</span>
          </button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Lịch hoạt động phòng {roomData.roomName}</h2>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng ký lịch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">{monthNames[currentMonth - 1]} {currentYear}</h3>
            <div className="flex space-x-2">
              <button onClick={handlePrevMonth} className="p-1 text-gray-600 hover:text-sky-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextMonth} className="p-1 text-gray-600 hover:text-sky-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateSelect(day.date)}
                className={`aspect-square flex items-center justify-center text-sm ${
                  day.day
                    ? 'font-medium text-gray-600'
                    : day.isToday
                    ? 'bg-sky-500 text-white rounded-lg font-medium'
                    : day.date
                    ? 'text-gray-900 hover:bg-sky-100 rounded-lg cursor-pointer transition-colors'
                    : ''
                }`}
              >
                {day.day || day.date}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-2">
          <h3 className="font-medium text-gray-900 mb-4">Lịch ngày {selectedDate}</h3>
          <div className="space-y-3">
            {activeEvent ? (
              <div>
                <h4 className="font-medium text-sky-800 mb-2">Đang hoạt động</h4>
                <div className="flex items-center justify-between p-3 border border-sky-200 rounded-lg bg-sky-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-sm text-sky-700">
                      <Clock className="w-4 h-4 mr-1" />
                      {activeEvent.timeRange || 'N/A'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{activeEvent.subject}</h4>
                      <p className="text-sm text-gray-600">{activeEvent.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-1 text-gray-400 hover:text-sky-600 transition-colors"
                      onClick={() => handleEditBooking(activeEvent)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => handleDeleteBooking(activeEvent.bookingId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Không có lịch đang hoạt động</p>
            )}
            {upcomingEvents.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 mt-4">Lịch tiếp theo</h4>
                {upcomingEvents.map((booking) => (
                  <div key={booking.bookingId} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {booking.timeRange || 'N/A'}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{booking.subject}</h4>
                        <p className="text-sm text-gray-600">{booking.teacher}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-gray-400 hover:text-sky-600 transition-colors"
                        onClick={() => handleEditBooking(booking)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDeleteBooking(booking.bookingId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {upcomingEvents.length === 0 && !activeEvent && (
              <p className="text-sm text-gray-500">Không có lịch tiếp theo</p>
            )}
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleModal 
          setShowScheduleModal={setShowScheduleModal} 
          roomId={roomData.roomId}
          editingBooking={editingBooking}
          onBookingAdded={() => {
            // Refresh bookings after adding a new one
            getBookingsByRoomId(roomData.roomId).then(data => {
              setBookings(data.allBookings);
              setEditingBooking(null);
            });
          }}
          onBookingUpdated={() => {
            // Refresh bookings after update
            getBookingsByRoomId(roomData.roomId).then(data => {
              setBookings(data.allBookings);
              setEditingBooking(null);
            });
          }}
          onCancel={() => setEditingBooking(null)}
        />
      )}
    </div>
  );
};

export default ScheduleTab;
