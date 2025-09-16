import React, { useState } from 'react';
import { Search, Monitor } from 'lucide-react';
import { Equipment } from '../../types';

interface EquipmentTableProps {
  equipment: Equipment[];
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({ equipment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-amber-100 text-amber-800';
      case 'broken': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working': return 'Hoạt động';
      case 'maintenance': return 'Bảo trì';
      case 'broken': return 'Hỏng';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'projector': return 'Máy chiếu';
      case 'air_conditioner': return 'Điều hòa';
      case 'camera': return 'Camera';
      case 'audio_system': return 'Hệ thống âm thanh';
      case 'computer': return 'Máy tính';
      default: return type;
    }
  };

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || eq.status === statusFilter;
    const matchesType = typeFilter === 'all' || eq.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const displayedEquipment = showAll ? filteredEquipment : filteredEquipment.slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Monitor className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Chi tiết thống kê thiết bị</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm thiết bị hoặc phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="working">Hoạt động</option>
          <option value="maintenance">Bảo trì</option>
          <option value="broken">Hỏng</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tất cả loại thiết bị</option>
          <option value="projector">Máy chiếu</option>
          <option value="air_conditioner">Điều hòa</option>
          <option value="camera">Camera</option>
          <option value="audio_system">Hệ thống âm thanh</option>
          <option value="computer">Máy tính</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="max-h-[400px] overflow-y-auto min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên thiết bị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phòng lắp đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại thiết bị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedEquipment.map((eq) => (
              <tr key={eq.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {eq.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {eq.room}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getTypeText(eq.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(eq.status)}`}>
                    {getStatusText(eq.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy thiết bị nào phù hợp với bộ lọc hiện tại.
        </div>
      )}

      {/* Nút xem thêm / thu gọn */}
      {filteredEquipment.length > 10 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {showAll ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EquipmentTable;
