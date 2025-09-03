import React, { useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: { search?: string; floor?: string; room?: string; type?: string; status?: string }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  // Sample data - replace with actual data source
  const initialDevices = [
    { floor: 'Tầng 1', room: 'Phòng 101', type: 'Đèn', status: 'Đang bật' },
    { floor: 'Tầng 2', room: 'Phòng 102', type: 'Máy lạnh', status: 'Lỗi' },
    { floor: 'Tầng 1', room: 'Sảnh', type: 'Camera', status: 'Đang bảo trì' },
    { floor: 'Tầng 3', room: 'Hành lang', type: 'Cảm biến nhiệt độ', status: 'Đang bật' },
  ];

  const floors = ['Tầng 1', 'Tầng 2', 'Tầng 3', 'Tầng 4', 'Tầng 5'];
  const rooms = ['Phòng 101', 'Phòng 102', 'Sảnh', 'Hành lang', 'Phòng họp'];
  const types = ['Đèn', 'Máy lạnh', 'Cảm biến nhiệt độ', 'Camera', 'Quạt'];
  const statuses = ['Đang bật', 'Đang tắt', 'Lỗi', 'Đang bảo trì'];

  // Calculate metrics
  const activeCount = initialDevices.filter(d => d.status === 'Đang bật' || d.status === 'Đang tắt').length;
  const errorCount = initialDevices.filter(d => d.status === 'Lỗi').length;
  const maintenanceCount = initialDevices.filter(d => d.status === 'Đang bảo trì').length;
  const totalDevices = initialDevices.length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value });
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'floor') setFloor(value);
    if (key === 'room') setRoom(value);
    if (key === 'type') setType(value);
    if (key === 'status') setStatus(value);
    onFilterChange({ [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Header with title and stats */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Quản lý thiết bị</h2>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Hoạt động</div>
            <div className="text-lg font-bold text-green-600">{activeCount}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Lỗi</div>
            <div className="text-lg font-bold text-red-600">{errorCount}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Bảo trì</div>
            <div className="text-lg font-bold text-yellow-600">{maintenanceCount}</div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm thiết bị..."
            value={search}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Filter controls */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tầng</label>
          <select
            value={floor}
            onChange={e => handleFilterChange('floor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả tầng</option>
            {floors.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
          <select
            value={room}
            onChange={e => handleFilterChange('room', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả phòng</option>
            {rooms.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại thiết bị</label>
          <select
            value={type}
            onChange={e => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả loại</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            value={status}
            onChange={e => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;