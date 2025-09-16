export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'theory' | 'computer' | 'auditorium' | 'lab';
  capacity: number;
  floor: number;
}

export interface Schedule {
  id: string;
  roomId: string;
  timeSlotId: string;
  date: string;
  subject: string;
  instructor: string;
  studentCount: number;
  phone: string;
  studentId?: string;
  purpose: string;
  createdBy: string;
  createdAt: string;
}

export interface BookingFormData {
  instructor: string;
  studentCount: number;
  phone: string;
  studentId?: string;
  purpose: string;
  date: string;
  timeSlotId: string;
  roomId: string;
  subject: string;
}

export type RoomType = 'all' | 'theory' | 'computer' | 'auditorium' | 'lab';