// src/utils/apiUnits.ts
import { getAuthToken } from './token';

export interface Unit {
  unitId: number;
  roomId: number;
  deviceType: string;
  deviceCode: string;
  status: boolean;
  detail: string;
}

export interface RoomWithUnits {
  roomId: number;
  roomName: string;
  units: Unit[];
}

const API_BASE_URL = 'https://localhost:7072/api';

export async function getAllRoomsWithUnits(): Promise<RoomWithUnits[]> {
  try {
    const token = getAuthToken();
    
    // Lấy danh sách phòng
    const roomsResponse = await fetch(`${API_BASE_URL}/Room/all-rooms/devices`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });
    
    if (roomsResponse.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!roomsResponse.ok) {
      throw new Error(`HTTP error! Status: ${roomsResponse.status}`);
    }
    
    const roomsData: any[] = await roomsResponse.json();
    
    // Lấy units cho từng phòng
    const roomsWithUnitsPromises = roomsData.map(async (room) => {
      try {
        const unitsResponse = await fetch(`${API_BASE_URL}/Unit/room/unit/getall/${room.roomId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          credentials: 'include',
        });
        
        if (unitsResponse.ok) {
          const unitsData: Unit[] = await unitsResponse.json();
          return {
            roomId: room.roomId,
            roomName: room.roomName,
            units: unitsData
          };
        } else {
          console.error(`Failed to fetch units for room ${room.roomId}`);
          return {
            roomId: room.roomId,
            roomName: room.roomName,
            units: []
          };
        }
      } catch (error) {
        console.error(`Error fetching units for room ${room.roomId}:`, error);
        return {
          roomId: room.roomId,
          roomName: room.roomName,
          units: []
        };
      }
    });
    
    const roomsWithUnits = await Promise.all(roomsWithUnitsPromises);
    return roomsWithUnits;
  } catch (error) {
    console.error('Error fetching rooms with units:', error);
    throw error;
  }
}

// Hàm tính toán thống kê
export function calculateDeviceStats(rooms: RoomWithUnits[]) {
  const allUnits = rooms.flatMap(room => room.units);
  
  return {
    totalAllDevices: allUnits.length,
    totalActiveDevices: allUnits.filter(unit => unit.status).length,
    totalMaintenanceDevices: allUnits.filter(unit => !unit.status).length,
    allDevices: allUnits,
    roomsWithDevices: rooms.map(room => ({
      ...room,
      totalDevices: room.units.length,
      activeDevices: room.units.filter(unit => unit.status).length,
      maintenanceDevices: room.units.filter(unit => !unit.status).length
    }))
  };
}

// Thêm thiết bị mới
export async function createUnit(unitData: Omit<Unit, 'unitId'>): Promise<Unit> {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/Unit/room/unit/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
      body: JSON.stringify(unitData)
    });
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating unit:', error);
    throw error;
  }
}

// Cập nhật thiết bị
export async function updateUnit(unitId: number, unitData: Partial<Unit>): Promise<Unit> {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/Unit/room/unit/update/${unitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
      body: JSON.stringify({ ...unitData, unitId })
    });
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
}

// Xóa thiết bị
export async function deleteUnit(unitId: number): Promise<void> {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/Unit/room/unit/delete/${unitId}`, {
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
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
}