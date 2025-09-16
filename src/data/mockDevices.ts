import { Device } from '../types';

export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Đèn LED Phòng A101',
    type: 'light',
    room: 'Phòng A101',
    floor: 1,
    status: 'active',
    lastData: '85% độ sáng',
    powerConsumption: 24,
    installDate: '2024-01-15',
    lastMaintenance: '2024-11-01',
    nextMaintenance: '2025-02-01',
    maintenanceHistory: [
      {
        id: '1',
        date: '2024-11-01',
        type: 'routine',
        technician: 'Nguyễn Văn A',
        description: 'Kiểm tra và vệ sinh định kỳ',
        status: 'completed'
      }
    ],
    activityLog: [
      {
        id: '1',
        timestamp: '2024-12-28 14:30:00',
        action: 'Bật đèn',
        user: 'Giáo viên Lan'
      }
    ]
  },
  {
    id: '2',
    name: 'Máy lạnh Samsung A101',
    type: 'ac',
    room: 'Phòng A101',
    floor: 1,
    status: 'active',
    lastData: '24°C',
    temperature: 24,
    powerConsumption: 1500,
    installDate: '2024-01-10',
    lastMaintenance: '2024-10-15',
    nextMaintenance: '2025-01-15',
    maintenanceHistory: [
      {
        id: '2',
        date: '2024-10-15',
        type: 'routine',
        technician: 'Trần Văn B',
        description: 'Vệ sinh lọc gió và kiểm tra gas',
        status: 'completed'
      }
    ],
    activityLog: [
      {
        id: '2',
        timestamp: '2024-12-28 13:15:00',
        action: 'Đặt nhiệt độ 24°C',
        user: 'Giáo viên Minh'
      }
    ]
  },
  {
    id: '3',
    name: 'Camera hành lang tầng 1',
    type: 'camera',
    room: 'Hành lang',
    floor: 1,
    status: 'active',
    lastData: 'Đang ghi hình',
    installDate: '2024-02-01',
    maintenanceHistory: [],
    activityLog: [
      {
        id: '3',
        timestamp: '2024-12-28 08:00:00',
        action: 'Khởi động hệ thống',
        user: 'Hệ thống'
      }
    ]
  },
  {
    id: '4',
    name: 'Cảm biến nhiệt độ A102',
    type: 'sensor',
    room: 'Phòng A102',
    floor: 1,
    status: 'error',
    lastData: 'Mất kết nối',
    temperature: 0,
    installDate: '2024-01-20',
    maintenanceHistory: [
      {
        id: '4',
        date: '2024-12-29',
        type: 'repair',
        technician: 'Lê Văn C',
        description: 'Sửa chữa lỗi kết nối',
        status: 'scheduled'
      }
    ],
    activityLog: [
      {
        id: '4',
        timestamp: '2024-12-28 16:45:00',
        action: 'Mất kết nối',
        user: 'Hệ thống',
        details: 'Cần kiểm tra đường truyền'
      }
    ]
  },
  {
    id: '5',
    name: 'Máy chiếu Epson A103',
    type: 'projector',
    room: 'Phòng A103',
    floor: 1,
    status: 'maintenance',
    lastData: 'Đang bảo trì',
    installDate: '2024-03-01',
    maintenanceHistory: [
      {
        id: '5',
        date: '2024-12-28',
        type: 'repair',
        technician: 'Phạm Văn D',
        description: 'Thay thế bóng đèn chiếu',
        status: 'in-progress'
      }
    ],
    activityLog: [
      {
        id: '5',
        timestamp: '2024-12-28 10:30:00',
        action: 'Đánh dấu cần bảo trì',
        user: 'Giáo viên Hoa'
      }
    ]
  },
  {
    id: '6',
    name: 'Đèn LED Phòng B201',
    type: 'light',
    room: 'Phòng B201',
    floor: 2,
    status: 'inactive',
    lastData: 'Tắt',
    powerConsumption: 0,
    installDate: '2024-01-15',
    maintenanceHistory: [],
    activityLog: [
      {
        id: '6',
        timestamp: '2024-12-28 17:00:00',
        action: 'Tắt đèn',
        user: 'Giáo viên Tuấn'
      }
    ]
  },
  {
    id: '7',
    name: 'Loa thông báo sảnh chính',
    type: 'speaker',
    room: 'Sảnh chính',
    floor: 0,
    status: 'active',
    lastData: 'Sẵn sàng phát thanh',
    installDate: '2024-02-15',
    maintenanceHistory: [],
    activityLog: [
      {
        id: '7',
        timestamp: '2024-12-28 07:30:00',
        action: 'Phát thông báo buổi sáng',
        user: 'Ban giám hiệu'
      }
    ]
  },
  {
    id: '8',
    name: 'Camera hành lang tầng 2',
    type: 'camera',
    room: 'Hành lang',
    floor: 2,
    status: 'active',
    lastData: 'Đang ghi hình',
    installDate: '2024-02-01',
    maintenanceHistory: [],
    activityLog: []
  }
];

export const floors = [0, 1, 2, 3];

export const getRoomsByFloor = (floor: number): string[] => {
  const rooms = mockDevices
    .filter(device => device.floor === floor)
    .map(device => device.room);
  return [...new Set(rooms)].sort();
};