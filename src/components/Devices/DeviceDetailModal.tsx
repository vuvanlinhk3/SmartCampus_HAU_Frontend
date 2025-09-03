import React, { useState } from 'react';
import { X, Calendar, User, CheckCircle, Clock, Power } from 'lucide-react';
import { Device, MaintenanceRecord, DeviceStatus } from '../types/device';

interface DeviceDetailModalProps {
  device: Device;
  isOpen: boolean;
  onClose: () => void;
  onMarkForMaintenance: (deviceId: string, note: string) => void;
  onToggleDevice: (deviceId: string, status: 'active' | 'inactive') => void;
  onUpdateStatus: (deviceId: string, status: DeviceStatus) => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  device,
  isOpen,
  onClose,
  onMarkForMaintenance,
  onToggleDevice,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance'>('overview');
  const [maintenanceNote, setMaintenanceNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DeviceStatus>(device.status);

  if (!isOpen) return null;

  const handleToggleDevice = () => {
    const newStatus = device.status === 'active' ? 'inactive' : 'active';
    onToggleDevice(device.id, newStatus);
  };

  const handleUpdateMaintenance = () => {
    if (maintenanceNote.trim()) {
      onMarkForMaintenance(device.id, maintenanceNote);
      setMaintenanceNote('');
    }
    onUpdateStatus(device.id, selectedStatus);
  };

  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-red-600';
      case 'error':
        return 'text-red-600';
      case 'maintenance':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: DeviceStatus) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Ngừng hoạt động';
      case 'error':
        return 'Lỗi';
      case 'maintenance':
        return 'Đang bảo trì';
      default:
        return status;
    }
  };

  const getMaintenanceStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getMaintenanceStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'in-progress':
        return 'Đang thực hiện';
      case 'scheduled':
        return 'Đã lên lịch';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">{device.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`w-1/2 py-4 px-6 text-center text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Tổng quan
              </button>
              <button
                className={`w-1/2 py-4 px-6 text-center text-sm font-medium border-b-2 ${
                  activeTab === 'maintenance'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('maintenance')}
              >
                Bảo trì
              </button>
            </nav>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Thông tin cơ bản
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mã thiết bị:</span>
                      <span className="text-sm font-medium text-gray-900">{device.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Loại thiết bị:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {device.type === 'light' ? 'Đèn chiếu sáng' :
                         device.type === 'ac' ? 'Máy lạnh' :
                         device.type === 'camera' ? 'Camera giám sát' :
                         device.type === 'sensor' ? 'Cảm biến' :
                         device.type === 'projector' ? 'Máy chiếu' :
                         device.type === 'speaker' ? 'Loa thông báo' : device.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Vị trí:</span>
                      <span className="text-sm font-medium text-gray-900">{device.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tầng:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {device.floor === 0 ? 'Tầng trệt' : `Tầng ${device.floor}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ngày lắp đặt:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(device.installDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <span className={`text-sm font-medium ${getStatusColor(device.status)}`}>
                        {getStatusText(device.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Parameters and Control */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Thông số hiện tại
                  </h4>
                  <div className="space-y-3">
                    {device.powerConsumption !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Điện năng tiêu thụ:</span>
                        <span className="text-sm font-medium text-gray-900">{device.powerConsumption}W</span>
                      </div>
                    )}
                    {device.lastData && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cập nhật gần nhất:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {device.lastData === 'Tắt' || device.lastData === 'Đang chờ bảo trì'
                            ? device.lastData
                            : new Date(device.lastData).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleToggleDevice}
                    disabled={device.status === 'error' || device.status === 'maintenance'}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      device.status === 'active'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    } ${device.status === 'error' || device.status === 'maintenance' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Power className="w-4 h-4 inline mr-2" />
                    {device.status === 'active' ? 'Tắt thiết bị' : 'Bật thiết bị'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                {/* Maintenance Status */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Trạng thái bảo trì
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as DeviceStatus)}
                        className="w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                        <option value="error">Lỗi</option>
                        <option value="maintenance">Đang bảo trì</option>
                      </select>
                    </div>
                    <textarea
                      value={maintenanceNote}
                      onChange={(e) => setMaintenanceNote(e.target.value)}
                      placeholder="Ghi chú về vấn đề cần bảo trì..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                    />
                    <button
                      onClick={handleUpdateMaintenance}
                      disabled={!maintenanceNote.trim()}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>

                {/* Maintenance History */}
                {device.maintenanceHistory.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      Lịch sử bảo trì
                    </h4>
                    <div className="space-y-3">
                      {device.maintenanceHistory.map((record: MaintenanceRecord) => (
                        <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getMaintenanceStatusIcon(record.status)}
                              <span className="font-medium text-gray-900">
                                {getMaintenanceStatusText(record.status)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(record.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700">{record.description}</p>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{record.technician}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};