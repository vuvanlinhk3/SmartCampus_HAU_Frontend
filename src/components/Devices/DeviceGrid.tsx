import React from 'react';
import DeviceCard from './DeviceCard';

interface Device {
  id: string;
  name: string;
  type: string;
  room: string;
  floor: string;
  status: 'on' | 'off' | 'error' | 'maintenance';
  latestData: string;
  image: string;
}

interface DeviceGridProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
}

const DeviceGrid: React.FC<DeviceGridProps> = ({ devices, onDeviceClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map(device => (
        <DeviceCard key={device.id} device={device} onClick={() => onDeviceClick(device)} />
      ))}
    </div>
  );
};

export default DeviceGrid;