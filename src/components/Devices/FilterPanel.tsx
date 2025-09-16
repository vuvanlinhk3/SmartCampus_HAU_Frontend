// src/components/Devices/FilterPanel.tsx
import React from 'react';
import { Search, MapPin, Building, Zap, Activity } from 'lucide-react';
import { DeviceType, DeviceStatus } from '../../types/index';

interface FilterPanelProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFloor: number | null;
  onFloorChange: (floor: number | null) => void;
  selectedRoom: string | null;
  onRoomChange: (room: string | null) => void;
  selectedType: DeviceType;
  onTypeChange: (type: DeviceType) => void;
  selectedStatus: DeviceStatus;
  onStatusChange: (status: DeviceStatus) => void;
  availableRooms: string[];
  floors: number[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  selectedFloor,
  onFloorChange,
  selectedRoom,
  onRoomChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  availableRooms,
  floors,
}) => {
  const deviceTypes = [
    { value: 'all' as DeviceType, label: 'Tất cả thiết bị' },
    { value: 'Bóng đèn' as DeviceType, label: 'Đèn chiếu sáng' },
    { 
    label: 'Máy lạnh',
    options: [
      { value: 'Điều hòa 1' as DeviceType, label: 'Điều hòa 1' },
      { value: 'Điều hòa 2' as DeviceType, label: 'Điều hòa 2' },
      { value: 'Điều hòa 3' as DeviceType, label: 'Điều hòa 3' },
    ]
  },
    { value: 'camera' as DeviceType, label: 'Camera giám sát' },
    { value: 'sensor' as DeviceType, label: 'Cảm biến' },
    { value: 'Máy Chiếu' as DeviceType, label: 'Máy chiếu' },
    { value: 'speaker' as DeviceType, label: 'Loa thông báo' },
  ];

  const statusTypes = [
    { value: 'all' as DeviceStatus, label: 'Tất cả trạng thái' },
    { value: 'active' as DeviceStatus, label: 'Đang hoạt động' },
    { value: 'inactive' as DeviceStatus, label: 'Đang tắt' },
    { value: 'error' as DeviceStatus, label: 'Lỗi' },
    { value: 'maintenance' as DeviceStatus, label: 'Đang bảo trì' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm thiết bị..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Floor Selection */}
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedFloor || ''}
            onChange={(e) => onFloorChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="">Tất cả tầng</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor === 0 ? 'Tầng trệt' : `Tầng ${floor}`}
              </option>
            ))}
          </select>
        </div>

        {/* Room Selection */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedRoom || ''}
            onChange={(e) => onRoomChange(e.target.value || null)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            disabled={!selectedFloor && selectedFloor !== 0}
          >
            <option value="">Tất cả phòng</option>
            {availableRooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        {/* Device Type */}
        <div className="relative">
          <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as DeviceType)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            {deviceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="relative">
          <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as DeviceStatus)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            {statusTypes.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};