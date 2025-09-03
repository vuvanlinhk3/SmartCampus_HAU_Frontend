import React from 'react';
import RoomCard, { Room } from './RoomCard';

interface FloorSectionProps {
  floor: number;
  rooms: Room[];
  stats: {
    empty: number;
    occupied: number;
    maintenance: number;
  };
}

export default function FloorSection({ floor, rooms, stats }: FloorSectionProps) {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Floor Header with accent border */}
      <div className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">{floor}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800">Tầng {floor}</h2>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Trống: {stats.empty}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Đang học: {stats.occupied}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Bảo trì: {stats.maintenance}</span>
          </div>
        </div>
      </div>

      {/* Rooms Grid with subtle background */}
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}