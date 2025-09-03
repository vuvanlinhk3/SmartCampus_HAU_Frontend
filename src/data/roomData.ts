import { Room } from '../components/RoomCard';

export const generateRoomData = (): Room[] => {
  const rooms: Room[] = [];
  const roomTypes: Room['type'][] = ['computer', 'drawing', 'theory', 'office'];
  const subjects = [
    'Tin học đại cương',
    'Kỹ thuật đồ họa', 
    'Toán cao cấp',
    'Vật lý đại cương',
    'Hóa học cơ bản',
    'Công nghệ thông tin',
    'Thiết kế đồ họa',
    'Quản lý dự án',
    'Lập trình C++',
    'Cơ sở dữ liệu',
    'Mạng máy tính',
    'Hệ điều hành'
  ];
  
  const instructors = [
    'GV. Trần Thị B',
    'TS. Nguyễn Văn A',
    'ThS. Lê Văn C', 
    'GS. Phạm Thị D',
    'ThS. Hoàng Văn E',
    'TS. Vũ Thị F',
    'GV. Đặng Văn G',
    'ThS. Bùi Thị H'
  ];

  // Tạo 20 tầng, mỗi tầng có 4-8 phòng ngẫu nhiên
  for (let floor = 1; floor <= 20; floor++) {
    const roomsPerFloor = Math.floor(Math.random() * 5) + 4; // 4-8 phòng
    
    for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
      const roomNumber = `M${floor}.${roomNum.toString().padStart(2, '0')}`;
      
      // Tỷ lệ trạng thái: 40% trống, 45% đang học, 15% bảo trì
      let status: Room['status'];
      const rand = Math.random();
      if (rand < 0.4) status = 'empty';
      else if (rand < 0.85) status = 'occupied';
      else status = 'maintenance';
      
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const capacity = roomType === 'office' ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 30) + 30;

      const room: Room = {
        id: `${floor}-${roomNum}`,
        floor,
        number: roomNumber,
        status,
        capacity,
        type: roomType,
      };

      if (status === 'occupied') {
        room.schedule = {
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          instructor: instructors[Math.floor(Math.random() * instructors.length)],
          time: `${Math.floor(Math.random() * 4) + 8}:00 - ${Math.floor(Math.random() * 4) + 10}:30`,
        };
      }

      rooms.push(room);
    }
  }

  return rooms;
};