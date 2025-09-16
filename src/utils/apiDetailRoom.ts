// src/utils/apiDetailRoom.ts
import { getAuthToken } from './token';

export interface RoomDetail {
  roomId: string;
  roomName: string;
  location: number;
  roomType: string;
  status: string;
  subject: string | null;
  teacher: string | null;
  timeRange: string | null;
  bookingDate: string;
  capacity?: number;
  area?: number;
  equipment?: Equipment[];
  isAvailable?: boolean;
  roomDevices?: any[];
  units?: any[];
  bookings?: any[];
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'on' | 'off' | 'maintenance';
}

// Interface cho Booking
export interface Booking {
  bookingId: number;
  roomId: number;
  className: string | null;
  subject: string;
  teacher: string;
  registeredBy: string;
  bookingDate: string;
  startPeriod: number;
  periods: number;
  createdAt: string;
  timeRange?: string; // Sẽ được tính toán từ startPeriod và periods
}

// Interface cho tạo mới Booking
export interface CreateBookingRequest {
  roomId: number;
  className: string | null;
  subject: string;
  teacher: string;
  registeredBy: string;
  bookingDate: string;
  startPeriod: number;
  periods: number;
}

// Interface cho kết quả trả về
export interface BookingResults {
  allBookings: Booking[];
  weeklyTotal: number;
  dailyBookings: Booking[];
  activeBooking: Booking | null;
  nextBooking: Booking | null;
}

// Hàm chuyển đổi period sang timeRange theo quy tắc mới
function periodToTimeRange(startPeriod: number, periods: number): string {
  // Định nghĩa thời gian bắt đầu cho từng tiết (tính bằng phút từ 0:00)
  const periodStartTimes: { [key: number]: number } = {
    1: 6 * 60 + 55,   // 6:55
    2: 7 * 60 + 45,   // 7:45
    3: 8 * 60 + 35,   // 8:35
    4: 9 * 60 + 30,   // 9:30
    5: 10 * 60 + 20,  // 10:20
    6: 11 * 60 + 15,  // 11:15
    7: 12 * 60 + 5,   // 12:05
    8: 12 * 60 + 55,  // 12:55
    9: 13 * 60 + 45,  // 13:45
    10: 14 * 60 + 40, // 14:40
    11: 15 * 60 + 30, // 15:30
    12: 16 * 60 + 20, // 16:20
    13: 17 * 60 + 30, // 17:30
    14: 18 * 60 + 20, // 18:20
    15: 19 * 60 + 15, // 19:15
    16: 20 * 60 + 5   // 20:05
  };

  // Định nghĩa thời gian kết thúc cho từng tiết
  const periodEndTimes: { [key: number]: number } = {
    1: 7 * 60 + 40,   // 7:40
    2: 8 * 60 + 30,   // 8:30
    3: 9 * 60 + 20,   // 9:20
    4: 10 * 60 + 15,  // 10:15
    5: 11 * 60 + 5,   // 11:05
    6: 12 * 60 + 0,   // 12:00
    7: 12 * 60 + 50,  // 12:50
    8: 13 * 60 + 40,  // 13:40
    9: 14 * 60 + 30,  // 14:30
    10: 15 * 60 + 25, // 15:25
    11: 16 * 60 + 15, // 16:15
    12: 17 * 60 + 5,  // 17:05
    13: 18 * 60 + 15, // 18:15
    14: 19 * 60 + 5,  // 19:05
    15: 20 * 60 + 0,  // 20:00
    16: 20 * 60 + 50  // 20:50
  };

  const startMinutes = periodStartTimes[startPeriod];
  const endMinutes = periodEndTimes[startPeriod + periods - 1];

  const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  return `${formatTime(startMinutes)} - ${formatTime(endMinutes)}`;
}

// Hàm lấy tất cả booking theo roomId và xử lý dữ liệu
export async function getBookingsByRoomId(roomId: string): Promise<BookingResults> {
  try {
    const token = getAuthToken();
    const response = await fetch(`https://localhost:7072/api/Booking/booking/getall/${roomId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const bookings: Booking[] = await response.json();

    // Thêm timeRange vào từng booking
    const bookingsWithTimeRange = bookings.map(booking => ({
      ...booking,
      timeRange: periodToTimeRange(booking.startPeriod, booking.periods)
    }));

    // Lấy ngày hiện tại
    const today = new Date().toISOString().split('T')[0];
    
    // Tính tổng booking trong tuần
    const weeklyTotal = bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    }).length;

    // Lọc booking theo ngày hiện tại
    const dailyBookings = bookingsWithTimeRange.filter(
      booking => booking.bookingDate.split('T')[0] === today
    );

    // Xác định booking đang hoạt động
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Tính bằng phút
    
    const activeBooking = dailyBookings.find(booking => {
      if (!booking.timeRange) return false;
      
      const [startTime] = booking.timeRange.split(' - ');
      const [hours, minutes] = startTime.split(':').map(Number);
      const startTimeInMinutes = hours * 60 + minutes;
      const endTimeInMinutes = startTimeInMinutes + booking.periods * 45;
      
      return currentTime >= startTimeInMinutes && currentTime < endTimeInMinutes;
    }) || null;

    // Xác định booking tiếp theo
    let nextBooking = null;
    if (activeBooking) {
      const [startTime] = activeBooking.timeRange!.split(' - ');
      const [hours, minutes] = startTime.split(':').map(Number);
      const activeEndTime = hours * 60 + minutes + activeBooking.periods * 45;
      
      nextBooking = dailyBookings.find(booking => {
        if (!booking.timeRange) return false;
        
        const [startTime] = booking.timeRange.split(' - ');
        const [hours, minutes] = startTime.split(':').map(Number);
        const bookingStartTime = hours * 60 + minutes;
        
        return bookingStartTime >= activeEndTime;
      }) || null;
    } else {
      nextBooking = dailyBookings.find(booking => {
        if (!booking.timeRange) return false;
        
        const [startTime] = booking.timeRange.split(' - ');
        const [hours, minutes] = startTime.split(':').map(Number);
        const bookingStartTime = hours * 60 + minutes;
        
        return bookingStartTime > currentTime;
      }) || null;
    }

    return {
      allBookings: bookingsWithTimeRange,
      weeklyTotal,
      dailyBookings,
      activeBooking,
      nextBooking
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

// Hàm thêm booking mới
export async function addBooking(bookingData: CreateBookingRequest): Promise<Booking> {
  try {
    const token = getAuthToken();
    const response = await fetch('https://localhost:7072/api/Booking/booking/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
      body: JSON.stringify(bookingData),
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newBooking: Booking = await response.json();
    return newBooking;
  } catch (error) {
    console.error('Error adding booking:', error);
    throw error;
  }
}

// Hàm cập nhật booking
export async function updateBooking(bookingId: number, bookingData: CreateBookingRequest): Promise<Booking> {
  try {
    const token = getAuthToken();
    const response = await fetch(`https://localhost:7072/api/Booking/booking/update/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
      body: JSON.stringify(bookingData),
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedBooking: Booking = await response.json();
    return updatedBooking;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

// Hàm xóa booking
export async function deleteBooking(bookingId: number): Promise<boolean> {
  try {
    const token = getAuthToken();
    const response = await fetch(`https://localhost:7072/api/Booking/booking/delete/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

export async function getRoomDetail(roomName: string): Promise<RoomDetail> {
  try {
    const token = getAuthToken();
    
    // First, get all rooms to find the status and additional fields
    const allRoomsResponse = await fetch('https://localhost:7072/api/Room/room/getall', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });
    
    if (allRoomsResponse.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!allRoomsResponse.ok) {
      throw new Error(`HTTP error! Status: ${allRoomsResponse.status}`);
    }
    
    const allRooms: any[] = await allRoomsResponse.json();
    
    // Find the room by name in the getAll response
    const roomFromGetAll = allRooms.find(room => room.roomName === roomName);
    
    if (!roomFromGetAll) {
      throw new Error(`Room with name ${roomName} not found`);
    }
    
    // Then, get detailed information from getbyname API
    const byNameResponse = await fetch(`https://localhost:7072/api/Room/room/getbyname/${roomName}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });
    
    if (byNameResponse.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!byNameResponse.ok) {
      throw new Error(`HTTP error! Status: ${byNameResponse.status}`);
    }
    
    const roomFromGetByName = await byNameResponse.json();
    
    // Combine data from both APIs
    const roomData: RoomDetail = {
      ...roomFromGetByName, // Base data from getbyname
      status: roomFromGetAll.status, // Status from getAll
      subject: roomFromGetAll.subject,
      teacher: roomFromGetAll.teacher,
      timeRange: roomFromGetAll.timeRange,
      bookingDate: roomFromGetAll.bookingDate,
      // Keep other fields from getbyname like roomDevices, units, bookings
    };
    
    return roomData;
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }
}