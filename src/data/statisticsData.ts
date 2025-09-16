import { Room, Equipment, Alert } from '../types';

export const rooms: Room[] = [
  { id: 'M101', floor: 1, name: 'M101', capacity: 50, type: 'lecture_hall', status: 'occupied', usageHours: 120 },
  { id: 'M102', floor: 1, name: 'M102', capacity: 30, type: 'classroom', status: 'vacant', usageHours: 85 },
  { id: 'M103', floor: 1, name: 'M103', capacity: 25, type: 'laboratory', status: 'maintenance', usageHours: 95 },
  { id: 'M201', floor: 2, name: 'M201', capacity: 60, type: 'lecture_hall', status: 'occupied', usageHours: 140 },
  { id: 'M202', floor: 2, name: 'M202', capacity: 40, type: 'classroom', status: 'vacant', usageHours: 110 },
  { id: 'M203', floor: 2, name: 'M203', capacity: 20, type: 'laboratory', status: 'occupied', usageHours: 75 },
  { id: 'M301', floor: 3, name: 'M301', capacity: 45, type: 'lecture_hall', status: 'vacant', usageHours: 90 },
  { id: 'M302', floor: 3, name: 'M302', capacity: 35, type: 'meeting_room', status: 'occupied', usageHours: 65 },
];

export const equipment: Equipment[] = [
  { id: 'PRJ001', name: 'Máy chiếu Epson', room: 'M101', type: 'projector', status: 'working', installDate: '2023-01-15', lastCheck: '2025-01-03' },
  { id: 'AC001', name: 'Điều hòa Daikin 18000BTU', room: 'M101', type: 'air_conditioner', status: 'broken', installDate: '2022-08-20', lastCheck: '2025-01-02' },
  { id: 'CAM001', name: 'Camera quan sát Hikvision', room: 'M101', type: 'camera', status: 'working', installDate: '2023-03-10', lastCheck: '2025-01-04' },
  { id: 'PRJ002', name: 'Máy chiếu Sony', room: 'M102', type: 'projector', status: 'maintenance', installDate: '2023-02-01', lastCheck: '2025-01-01' },
  { id: 'AC002', name: 'Điều hòa LG 24000BTU', room: 'M102', type: 'air_conditioner', status: 'working', installDate: '2022-09-15', lastCheck: '2025-01-03' },
  { id: 'AUD001', name: 'Hệ thống âm thanh Bose', room: 'M201', type: 'audio_system', status: 'working', installDate: '2023-04-20', lastCheck: '2025-01-04' },
  { id: 'PC001', name: 'Máy tính Dell OptiPlex', room: 'M203', type: 'computer', status: 'working', installDate: '2023-05-10', lastCheck: '2025-01-03' },
  { id: 'AC003', name: 'Điều hòa Panasonic 18000BTU', room: 'M203', type: 'air_conditioner', status: 'broken', installDate: '2022-07-25', lastCheck: '2025-01-02' },
];

export const alerts: Alert[] = [
  {
    id: 'alert1',
    type: 'critical',
    title: 'Hệ thống điều hòa M101 gặp sự cố',
    message: 'Điều hòa tại phòng M101 đã ngưng hoạt động từ 8:30 sáng nay. Cần thay thế ngay để đảm bảo chất lượng học tập.',
    timestamp: '2025-01-04T08:30:00'
  },
  {
    id: 'alert2',
    type: 'warning',
    title: 'Máy chiếu M102 cần bảo trì',
    message: 'Máy chiếu tại phòng M102 đang trong thời gian bảo trì định kỳ. Dự kiến hoàn thành vào 15:00 chiều nay.',
    timestamp: '2025-01-04T09:15:00'
  },
  {
    id: 'alert3',
    type: 'critical',
    title: 'Điều hòa M203 hỏng',
    message: 'Hệ thống điều hòa phòng M203 đã hỏng và cần được thay thế. Phòng tạm thời không khả dụng.',
    timestamp: '2025-01-04T07:45:00'
  }
];

export const usageByFloor = [
  { floor: 1, usage: 75 },
  { floor: 2, usage: 90 },
  { floor: 3, usage: 60 },
  { floor: 4, usage: 45 },
  { floor: 5, usage: 80 },
];

export const monthlyUsage = [
  { month: 'T1', usage: 85 },
  { month: 'T2', usage: 78 },
  { month: 'T3', usage: 92 },
  { month: 'T4', usage: 88 },
  { month: 'T5', usage: 95 },
  { month: 'T6', usage: 82 },
];