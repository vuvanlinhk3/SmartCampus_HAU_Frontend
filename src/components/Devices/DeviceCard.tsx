import React from 'react';

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

interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  const statusColor = {
    on: 'bg-green-500',
    off: 'bg-gray-500',
    error: 'bg-red-500',
    maintenance: 'bg-yellow-500',
  }[device.status];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement toggle logic here (e.g., API call)
    console.log(`Toggling ${device.name}`);
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <img src={device.image} alt={device.name} className="w-full h-32 object-cover rounded mb-4" />
      <h3 className="text-lg font-semibold">{device.name}</h3>
      <p className="text-sm text-gray-600">Phòng: {device.room}</p>
      <p className="text-sm text-gray-600">Trạng thái: {device.status}</p>
      <p className="text-sm text-gray-600">Dữ liệu: {device.latestData}</p>
      <div className="flex items-center mt-4">
        <div className={`w-4 h-4 rounded-full ${statusColor} mr-2`} />
        <button
          onClick={handleToggle}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {device.status === 'on' ? 'Tắt' : 'Bật'}
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;