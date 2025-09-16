// src/utils/roomApi.ts
import { getAuthToken } from './token';
import { Room } from '../components/Rooms/RoomCard';

interface ApiRoom {
  roomId: string;
  roomName: string;
  location: number;
  roomType: string;
  status: string;
  subject: string | null;
  teacher: string | null;
  timeRange: string | null;
  bookingDate: string;
}

interface BuildingData {
  stats: {
    empty: number;
    occupied: number;
    maintenance: number;
    utilizationRate: number;
  };
  floors: Array<{
    floor: number;
    rooms: Room[];
    stats: {
      empty: number;
      occupied: number;
      maintenance: number;
    };
  }>;
}

const API_BASE_URL = 'https://localhost:7072/api';

export async function getAllRooms(): Promise<BuildingData> {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/Room/room/getall`, {
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
    
    const apiData: ApiRoom[] = await response.json();
    
    // Map status từ tiếng Việt sang enum
    const statusMap: Record<string, Room['status']> = {
      'Trống': 'empty',
      'Đang học': 'occupied',
      'Bảo trì': 'maintenance',
    };
    
    // Map room type từ API sang type trong ứng dụng
    const roomTypeMap: Record<string, Room['type']> = {
      'hoc': 'theory',
      've': 'drawing', 
      'may': 'computer',
      'xuong': 'workshop',
      'vanphongkhoacntt': 'office',
      'vanphongkhoa': 'office',
      'vanphong': 'faculty'
    };
    
    // Group rooms by floor (location)
    const floorsMap = new Map<number, Room[]>();
    
    apiData.forEach((apiRoom) => {
      const floor = apiRoom.location;
      const status = statusMap[apiRoom.status] || 'maintenance';
      
      // Map room type với giá trị mặc định là 'theory'
      const roomTypeKey = apiRoom.roomType?.toLowerCase() || '';
      const roomType = roomTypeMap[roomTypeKey] || 'theory';
      
      const room: Room = {
        id: apiRoom.roomId,
        floor,
        number: apiRoom.roomName,
        status,
        type: roomType,
        schedule: apiRoom.status === 'Đang học' && apiRoom.subject 
          ? {
              subject: apiRoom.subject,
              instructor: apiRoom.teacher || 'Không xác định',
              time: apiRoom.timeRange || 'Không xác định',
            }
          : undefined,
      };
      
      if (!floorsMap.has(floor)) {
        floorsMap.set(floor, []);
      }
      floorsMap.get(floor)!.push(room);
    });
    
    // Tính stats toàn building
    let empty = 0;
    let occupied = 0;
    let maintenance = 0;
    
    const floors: BuildingData['floors'] = Array.from(floorsMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([floor, rooms]) => {
        const floorEmpty = rooms.filter(r => r.status === 'empty').length;
        const floorOccupied = rooms.filter(r => r.status === 'occupied').length;
        const floorMaintenance = rooms.filter(r => r.status === 'maintenance').length;
        
        empty += floorEmpty;
        occupied += floorOccupied;
        maintenance += floorMaintenance;
        
        return {
          floor,
          rooms,
          stats: {
            empty: floorEmpty,
            occupied: floorOccupied,
            maintenance: floorMaintenance,
          },
        };
      });
    
    const total = empty + occupied + maintenance;
    const utilizationRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    
    return {
      stats: {
        empty,
        occupied,
        maintenance,
        utilizationRate,
      },
      floors,
    };
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
}