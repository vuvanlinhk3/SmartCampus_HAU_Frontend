export interface Device {
  id: string;
  name: string;
  type: 'light' | 'ac' | 'camera' | 'sensor' | 'projector' | 'speaker';
  room: string;
  floor: number;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  lastData?: string;
  powerConsumption?: number;
  temperature?: number;
  installDate: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  maintenanceHistory: MaintenanceRecord[];
  activityLog: ActivityLog[];
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'routine' | 'repair' | 'replacement';
  technician: string;
  description: string;
  status: 'completed' | 'scheduled' | 'in-progress';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

export type DeviceType = 'all' | 'light' | 'ac' | 'camera' | 'sensor' | 'projector' | 'speaker';
export type DeviceStatus = 'all' | 'active' | 'inactive' | 'error' | 'maintenance';