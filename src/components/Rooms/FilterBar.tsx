import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedFloor,
  setSelectedFloor,
  selectedStatus,
  setSelectedStatus,
}: FilterBarProps) {
  return (
    <div className="flex items-center space-x-4 mb-6 bg-white p-4 rounded-lg shadow-md">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Nhập để tìm kiếm Tầng, Phòng, giảng viên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Floor Filter */}
      <div className="relative">
        <select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px] text-sm text-gray-700"
        >
          <option value="">Tất cả Tầng</option>
          {[...Array(20)].map((_, i) => (
            <option key={i + 1} value={`${i + 1}`}>Tầng {i + 1}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
        >
          <option value="">Tất cả Trạng Thái</option>
          <option value="empty">Trống</option>
          <option value="occupied">Đang học</option>
          <option value="maintenance">Bảo trì</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      </div>
    </div>
  );
}