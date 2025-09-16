// src/components/RoomCard.tsx
import React from 'react';
import { Clock, Monitor, PenTool, BookOpen, Briefcase,Factory } from 'lucide-react';
import { Link } from 'react-router-dom';
export interface Room {
  id: string;
  floor: number;
  number: string;
  status: 'empty' | 'occupied' | 'maintenance';
  type: 'computer' | 'drawing' | 'theory' | 'office' | 'workshop' |'faculty';
  schedule?: {
    subject: string;
    instructor: string;
    time: string;
  };
}

interface RoomCardProps {
  room: Room;
}

const roomTypeInfo = {
  computer: { label: 'Phòng máy', icon: Monitor, color: 'text-blue-600' },
  drawing: { label: 'Phòng vẽ', icon: PenTool, color: 'text-purple-600' },
  theory: { label: 'Phòng lý thuyết', icon: BookOpen, color: 'text-green-600' },
  office: { label: 'Văn phòng khoa', icon: Briefcase, color: 'text-gray-600' },
  faculty: { label: 'Văn phòng', icon: Briefcase, color: 'text-indigo-600' },
  workshop: { label: 'Xưởng', icon: Factory, color: 'text-orange-600' },
};

const statusColors = {
  empty: 'border-2 border-green-400 bg-white',
  occupied: 'border-2 border-red-400 bg-white',
  maintenance: 'border-2 border-yellow-400 bg-white',
};

const statusLabels = {
  empty: 'Trống',
  occupied: 'Đang học',
  maintenance: 'Bảo trì',
};

const statusBadgeColors = {
  empty: 'bg-green-500 text-white',
  occupied: 'bg-red-500 text-white',
  maintenance: 'bg-yellow-500 text-white',
};

export default function RoomCard({ room }: RoomCardProps) {
  const typeInfo = roomTypeInfo[room.type];
  const TypeIcon = typeInfo.icon;

  return (
    <Link className ={`grid  auto-rows-fr`} to={`/room/${room.number}`}> {/* Thêm Link */}
    <div className={`rounded-lg p-3 transition-all hover:shadow-md ${statusColors[room.status]} min-h-[140px]`}>
      {/* Room Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-base text-gray-800">{room.number}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadgeColors[room.status]}`}>
          {statusLabels[room.status]}
        </span>
      </div>

      {/* Room Type */}
      <div className="flex items-center space-x-2 mb-2">
        <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
        <span className={`text-xs font-medium ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
      </div>

      {/* Schedule Info (if occupied) */}
      {room.status === 'occupied' && room.schedule && (
        <div className="mb-2 p-2 bg-gray-50 rounded border">
          <p className="font-medium text-xs text-gray-800 mb-1">{room.schedule.subject}</p>
          <p className="text-xs text-gray-600">GV: {room.schedule.instructor}</p>
          <div className="flex items-center space-x-1 mt-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">{room.schedule.time}</span>
          </div>
        </div>
      )}
    </div>
    </Link>
  );
}