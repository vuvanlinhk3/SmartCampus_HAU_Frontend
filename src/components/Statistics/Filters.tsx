import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFiltersChange }) => {
  const roomTypes = [
    { value: 'all', label: 'Tất cả loại phòng' },
    { value: 'lecture_hall', label: 'Giảng đường' },
    { value: 'laboratory', label: 'Phòng thí nghiệm' },
    { value: 'classroom', label: 'Phòng học' },
    { value: 'meeting_room', label: 'Phòng họp' }
  ];
  const roomStatuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'occupied', label: 'Đang sử dụng' },
    { value: 'vacant', label: 'Trống' },
    { value: 'maintenance', label: 'Bảo trì' }
  ];
  const floors = [
    { value: 'all', label: 'Tất cả tầng' },
    ...Array.from({ length: 20 }, (_, i) => ({ 
      value: (i + 1).toString(), 
      label: `Tầng ${i + 1}` 
    }))
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Bộ lọc thống kê</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Khoảng thời gian
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => onFiltersChange({ ...filters, timeRange: e.target.value as any })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="month">Theo tháng</option>
            <option value="quarter">Theo quý</option>
            <option value="year">Theo năm</option>
          </select>
        </div>

        {/* Floor Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tầng
          </label>
          <select
            value={filters.floor}
            onChange={(e) => onFiltersChange({ ...filters, floor: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {floors.map(floor => (
              <option key={floor.value} value={floor.value}>{floor.label}</option>
            ))}
          </select>
        </div>

        {/* Room Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại phòng
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => onFiltersChange({ ...filters, roomType: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {roomTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Room Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tình trạng phòng
          </label>
          <select
            value={filters.roomStatus}
            onChange={(e) => onFiltersChange({ ...filters, roomStatus: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {roomStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;