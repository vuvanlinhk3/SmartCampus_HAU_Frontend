// src/components/Devices/DeviceCard.tsx
import React from 'react';
import { Lightbulb, Thermometer, Camera, Gauge, Projector, Volume2, Settings } from 'lucide-react';
import { Device } from '../../types/index';

interface DeviceCardProps {
  device: Device;
  onToggle: (deviceId: string) => void;
  onViewDetails: (device: Device) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle, onViewDetails }) => {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Bóng đèn':
        return <Lightbulb className="w-6 h-6" />;
      case 'Điều hòa 1':
      case 'Điều hòa':
        return <Thermometer className="w-6 h-6" />;
      case 'Điều hòa 2':
        return <Thermometer className="w-6 h-6" />;
      case 'Điều hòa 3':
        return <Thermometer className="w-6 h-6" />;
      case 'Điều hòa 4':
        return <Thermometer className="w-6 h-6" />;
      case 'camera':
        return <Camera className="w-6 h-6" />;
      case 'Cảm Biến':
        return <Gauge className="w-6 h-6" />;
      case 'Nhiệt độ':
        return <Gauge className="w-6 h-6" />;
      case 'projector':
      case 'Máy chiếu':
      case 'Máy Chiếu':
      case 'Ti Vi':
        return <Projector className="w-6 h-6" />;
      case 'speaker':
        return <Volume2 className="w-6 h-6" />;
      default:
        return <Settings className="w-6 h-6" />;
    }
  };

  const getDeviceTypeName = (type: string) => {
    switch (type) {
      case 'Bóng đèn':
        return 'Đèn chiếu sáng';
      case 'Điều hòa':
        return 'Máy lạnh';
      case 'Điều hòa 1':
        return 'Máy lạnh';
      case 'Điều hòa 2':
        return 'Máy lạnh';
      case 'Điều hòa 3':
        return 'Máy lạnh';
      case 'camera':
        return 'Camera giám sát';
      case 'sensor':
        return 'Cảm biến';
      case 'Máy Chiếu':
        return 'Máy chiếu';
      case 'Ti Vi':
        return 'Máy chiếu';
      case 'speaker':
        return 'Loa thông báo';
      default:
        return 'Thiết bị';
    }
  };

  const getStatusBadge = (device: Device) => {
    if (device.status === 'maintenance') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Bảo trì
        </span>
      );
    }
    
    // For non-maintenance devices, show operational status
    if (device.lastData === 'Đang hoạt động') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Hoạt động
        </span>
      );
    } else if (device.lastData === 'Tắt') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Tắt
        </span>
      );
    }
    
    return null;
  };

  const getToggleButton = (device: Device) => {
    // Check if device is in maintenance mode based on the API status
    const isInMaintenance = device.status === 'maintenance';
    
    if (isInMaintenance) {
      return (
        <button
          disabled
          className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          Đang bảo trì
        </button>
      );
    }

    // For non-maintenance devices, show toggle button based on operational status
    if (device.lastData === 'Đang hoạt động') {
      return (
        <button
          onClick={() => onToggle(device.id)}
          className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          Tắt
        </button>
      );
    }

    return (
      <button
        onClick={() => onToggle(device.id)}
        className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
      >
        Bật
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header with Icon and Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className={`p-2 rounded-lg ${
              device.status === 'maintenance'
                ? 'bg-orange-100 text-orange-600'
                : device.lastData === 'Đang hoạt động'
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {getDeviceIcon(device.type)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm">{device.name}</h3>
            <p className="text-xs text-gray-500">{getDeviceTypeName(device.type)}</p>
          </div>
        </div>
        {getStatusBadge(device)}
      </div>

      {/* Device Info */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">Cập nhật 1 phút trước</p>
        {device.temperature && (
          <p className="text-sm font-medium text-gray-900">{device.temperature}°C</p>
        )}
        {device.lastData && !device.temperature && (
          <p className="text-sm text-gray-700">{device.lastData}</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onViewDetails(device)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Chi tiết
        </button>
        {getToggleButton(device)}
      </div>
    </div>
  );
};