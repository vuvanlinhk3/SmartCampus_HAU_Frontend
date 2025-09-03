import React from 'react';
import { Building2, Clock } from 'lucide-react';

interface BuildingOverviewProps {
  stats: {
    empty: number;
    occupied: number;
    maintenance: number;
    utilizationRate: number;
  };
}

export default function BuildingOverview({ stats }: BuildingOverviewProps) {
  const totalRooms = stats.empty + stats.occupied + stats.maintenance;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-3 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Tòa nhà M</h2>
            <p className="text-sm text-gray-600">20 tầng • {totalRooms} phòng học</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Trống: {stats.empty}</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Đang học: {stats.occupied}</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Bảo trì: {stats.maintenance}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Tỷ lệ sử dụng: <span className="ml-1 font-medium text-gray-800">{stats.utilizationRate}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}