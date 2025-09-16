// src/types/index.ts
export type DeviceType = 'all' | 'light' | 'ac' | 'camera' | 'sensor' | 'projector' | 'speaker';
export type DeviceStatus = 'active' | 'inactive' | 'error' | 'maintenance';
export type FilterStatus = 'all' | DeviceStatus;

export interface Device {
  id: string;
  code:string;
  name: string;
  type: string;
  status: DeviceStatus;
  room: string;
  floor: number;
  lastData?: string;
  powerConsumption?: number;
  temperature?: number;
  installDate: string;
  maintenanceHistory: MaintenanceRecord[];
  activityLog: ActivityLog[];
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'repair' | 'maintenance';
  technician: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}
// thong ke interface


export interface Room {
  id: number;
  floor: number;
  name: string;
  capacity: number;
  type: 'lecture_hall' | 'laboratory' | 'classroom' | 'meeting_room'| string;
  status: 'occupied' | 'vacant' | 'maintenance';
  usageHours: number;
}

export interface Equipment {
  id: string;
  name: string;
  room: string;
  type: 'projector' | 'air_conditioner' | 'camera' | 'audio_system' | 'computer'| string;
  status: 'working' | 'maintenance' | 'broken';
  installDate: string;
  lastCheck: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface FilterState {
  timeRange: 'month' | 'quarter' | 'year';
  floor: string;
  roomType: string;
  roomStatus: string;
}


// thoi khoa bieu interface
