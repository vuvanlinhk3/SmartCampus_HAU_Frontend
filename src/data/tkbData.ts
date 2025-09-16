import { TimeSlot, Room, Schedule } from '../types/tkb';

export const timeSlots: TimeSlot[] = [
  { id: '1', startTime: '6h55', endTime: '7h40' },
  { id: '2', startTime: '7h45', endTime: '8h30' },
  { id: '3', startTime: '8h35', endTime: '9h20' },
  { id: '4', startTime: '9h30', endTime: '10h15' },
  { id: '5', startTime: '10h20', endTime: '11h05' },
  { id: '6', startTime: '11h10', endTime: '11h55' },
  { id: '7', startTime: '12h05', endTime: '12h50' },
  { id: '8', startTime: '13h45', endTime: '14h30' },
  { id: '9', startTime: '14h40', endTime: '15h25' },
  { id: '10', startTime: '15h30', endTime: '16h15' },
  { id: '11', startTime: '16h20', endTime: '17h05' },
  { id: '12', startTime: '17h30', endTime: '18h15' },
  { id: '13', startTime: '18h20', endTime: '19h05' },
  { id: '14', startTime: '19h15', endTime: '20h00' },
  { id: '15', startTime: '20h05', endTime: '20h50' },
];

export const rooms: Room[] = [
  { id: '1', name: 'M1.01', type: 'theory', capacity: 50, floor: 1 },
  { id: '2', name: 'M1.02', type: 'theory', capacity: 50, floor: 1 },
  { id: '3', name: 'M1.03', type: 'computer', capacity: 40, floor: 1 },
  { id: '4', name: 'M1.04', type: 'computer', capacity: 40, floor: 1 },
  { id: '5', name: 'M2.01', type: 'theory', capacity: 60, floor: 2 },
  { id: '6', name: 'M2.02', type: 'theory', capacity: 60, floor: 2 },
  { id: '7', name: 'M2.03', type: 'lab', capacity: 30, floor: 2 },
  { id: '8', name: 'M2.04', type: 'lab', capacity: 30, floor: 2 },
  { id: '9', name: 'M3.01', type: 'auditorium', capacity: 200, floor: 3 },
  { id: '10', name: 'M3.02', type: 'theory', capacity: 80, floor: 3 },
];

export const schedules: Schedule[] = [
  {
    id: '1',
    roomId: '1',
    timeSlotId: '1',
    date: '2025-01-15',
    subject: 'Toán cao cấp A1',
    instructor: 'TS. Nguyễn Văn A',
    studentCount: 45,
    phone: '0123456789',
    purpose: 'Dạy học',
    createdBy: 'admin',
    createdAt: '2025-01-10T08:00:00Z'
  },
  {
    id: '2',
    roomId: '3',
    timeSlotId: '2',
    date: '2025-01-15',
    subject: 'Thực hành lập trình',
    instructor: 'ThS. Trần Thị B',
    studentCount: 35,
    phone: '0987654321',
    purpose: 'Dạy học',
    createdBy: 'admin',
    createdAt: '2025-01-10T09:00:00Z'
  },
  {
    id: '3',
    roomId: '5',
    timeSlotId: '8',
    date: '2025-01-15',
    subject: 'Họp nhóm đồ án',
    instructor: 'Sinh viên Lê Văn C',
    studentCount: 8,
    phone: '0345678901',
    studentId: 'SV2021001',
    purpose: 'Học nhóm',
    createdBy: 'student',
    createdAt: '2025-01-12T14:00:00Z'
  },
  {
    id: '4',
    roomId: '2',
    timeSlotId: '3',
    date: '2025-01-15',
    subject: 'Vật lý đại cương',
    instructor: 'PGS. Phạm Văn D',
    studentCount: 48,
    phone: '0912345678',
    purpose: 'Dạy học',
    createdBy: 'admin',
    createdAt: '2025-01-11T10:00:00Z'
  },
  {
    id: '5',
    roomId: '4',
    timeSlotId: '4',
    date: '2025-01-15',
    subject: 'Thực hành Java',
    instructor: 'ThS. Hoàng Thị E',
    studentCount: 30,
    phone: '0934567890',
    purpose: 'Dạy học',
    createdBy: 'admin',
    createdAt: '2025-01-11T11:00:00Z'
  },
  {
    id: '6',
    roomId: '7',
    timeSlotId: '5',
    date: '2025-01-15',
    subject: 'Thí nghiệm Hóa học',
    instructor: 'TS. Lê Văn F',
    studentCount: 25,
    phone: '0956789012',
    purpose: 'Dạy học',
    createdBy: 'admin',
    createdAt: '2025-01-11T12:00:00Z'
  },
  {
    id: '7',
    roomId: '9',
    timeSlotId: '9',
    date: '2025-01-15',
    subject: 'Hội thảo khoa học sinh viên',
    instructor: 'PGS. Nguyễn Thị G',
    studentCount: 150,
    phone: '0978901234',
    purpose: 'Hội thảo',
    createdBy: 'admin',
    createdAt: '2025-01-12T08:00:00Z'
  },
  {
    id: '8',
    roomId: '1',
    timeSlotId: '6',
    date: '2025-01-15',
    subject: 'Tiếng Anh chuyên ngành',
    instructor: 'ThS. Vũ Thị H',
    studentCount: 40,
    phone: '0901234567',
    purpose: 'Dạy học',
    createdBy: 'admin',
    createdAt: '2025-01-12T09:00:00Z'
  },
  {
    id: '9',
    roomId: '6',
    timeSlotId: '10',
    date: '2025-01-15',
    subject: 'Seminar nhóm NCKH',
    instructor: 'Sinh viên Đỗ Văn I',
    studentCount: 12,
    phone: '0923456789',
    studentId: 'SV2020015',
    purpose: 'Học nhóm',
    createdBy: 'student',
    createdAt: '2025-01-13T15:00:00Z'
  },
  {
    id: '10',
    roomId: '8',
    timeSlotId: '7',
    date: '2025-01-15',
    subject: 'Thí nghiệm Vật lý',
    instructor: 'TS. Bùi Văn K',
    studentCount: 28,
    phone: '0945678901',
    purpose: 'Dạy học',
    createdBy: 'admin',
    createdAt: '2025-01-13T16:00:00Z'
  }
];

export const roomTypeLabels = {
  all: 'Tất cả',
  theory: 'Phòng lý thuyết',
  computer: 'Phòng máy tính',
  auditorium: 'Hội trường',
  lab: 'Phòng thí nghiệm'
};