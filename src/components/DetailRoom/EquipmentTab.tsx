// src/components/DetailRoom/EquipmentTab.tsx
import React, { useState } from 'react';
import { Plus, Settings, Edit, Trash2, Power } from 'lucide-react';

type EquipmentStatus = 'active' | 'maintenance';

interface Equipment {
  id: string;
  deviceType: string;
  deviceCode: string;
  status: EquipmentStatus;
  detail: string;
  isOn: boolean;
  icon: React.ReactNode;
}

interface EquipmentTabProps {
  equipment: Equipment[];
  onAddEquipment: () => void;
  onEditEquipment: (equipment: Equipment) => void;
  onToggleEquipment: (id: string) => void;
  onUpdateStatus: (id: string, status: EquipmentStatus) => void;
  onDeleteEquipment: (id: string) => void;
}

const EquipmentTab: React.FC<EquipmentTabProps> = ({ 
  equipment, 
  onAddEquipment, 
  onEditEquipment,
  onToggleEquipment, 
  onUpdateStatus,
  onDeleteEquipment 
}) => {
  const getStatusText = (status: EquipmentStatus) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'maintenance': return 'Đang bảo trì';
      default: return 'Không xác định';
    }
  };

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 text-xs px-2 py-1 rounded';
      case 'maintenance': return 'bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded';
      default: return 'bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded';
    }
  };

  const getPowerButtonClass = (isOn: boolean) => {
    return isOn 
      ? 'bg-red-500 text-white hover:bg-red-600' 
      : 'bg-green-500 text-white hover:bg-green-600';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      onDeleteEquipment(id);
    }
  };

  const handleStatusChange = (id: string, currentStatus: EquipmentStatus) => {
    const newStatus = currentStatus === 'active' ? 'maintenance' : 'active';
    onUpdateStatus(id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Quản lý thiết bị</h2>
        <button 
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          onClick={onAddEquipment}
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thiết bị</span>
        </button>
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Chưa có thiết bị nào trong phòng này.</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={onAddEquipment}
          >
            Thêm thiết bị đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-600">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.deviceType}</h3>
                    <p className="text-sm text-gray-500">{item.deviceType}</p>
                  </div>
                </div>
                <span className={getStatusBadge(item.status)}>
                  {getStatusText(item.status)}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600">{item.detail || 'Không có mô tả'}</p>
              </div>
              
              <div className="space-y-2">
                {item.status === 'maintenance' ? (
                  <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                    <Settings className="w-4 h-4 mr-1" />
                    Đang bảo trì - Không thể thao tác
                  </div>
                ) : (
                  <button
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${getPowerButtonClass(item.isOn)}`}
                    onClick={() => onToggleEquipment(item.id)}
                  >
                    <Power className="w-4 h-4 mr-1" />
                    {item.isOn ? 'Tắt' : 'Bật'}
                  </button>
                )}
                
                <div className="flex space-x-2">
                  <button 
                    className="flex-1 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => onEditEquipment(item)}
                  >
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button 
                    className="flex-1 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
                
                <button
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    item.status === 'active' 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  onClick={() => handleStatusChange(item.id, item.status)}
                >
                  {item.status === 'active' ? 'Đánh dấu bảo trì' : 'Đánh dấu hoạt động'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentTab;