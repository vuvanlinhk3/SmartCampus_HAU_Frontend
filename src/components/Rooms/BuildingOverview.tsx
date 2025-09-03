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
    <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
      <div className="mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Phần thông tin tòa nhà - luôn nằm bên trái */}
          <div className="flex items-start gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Tòa nhà M</h2>
              <p className="text-blue-100 mt-1">20 tầng • {totalRooms} phòng học</p>
            </div>
          </div>

          {/* Phần thống kê - nằm bên phải */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Trống: {stats.empty}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Đang học: {stats.occupied}
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Bảo trì: {stats.maintenance}
              </span>
            </div>
            
            <div className="flex items-center text-blue-100">
              <Clock className="w-4 h-4 mr-1" />
              Tỷ lệ sử dụng: 
              <span className="ml-1 font-medium text-white">{stats.utilizationRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}