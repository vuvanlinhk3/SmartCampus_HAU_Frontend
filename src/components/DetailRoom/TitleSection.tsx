// src/components/TitleSection.tsx
import React from 'react';
import { RoomDetail } from '../../utils/apiDetailRoom';

interface TitleSectionProps {
  roomData: RoomDetail;
}

const TitleSection: React.FC<TitleSectionProps> = ({ roomData }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Trống': return 'bg-green-500';
      case 'Đang học': return 'bg-red-500';
      case 'Bảo trì': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thông tin phòng {roomData.roomName}</h1>
            <p className="text-gray-600 mt-1">Quản lý chi tiết phòng học và thiết bị</p>
          </div>
          <span className={`${getStatusColor(roomData.status)} text-white px-4 py-2 rounded-lg text-sm font-medium`}>
            {roomData.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;