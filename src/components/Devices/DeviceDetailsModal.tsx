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

interface DeviceDetailsModalProps {
  device: Device;
  onClose: () => void;
}

const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({ device, onClose }) => {
  const handleMaintenanceRequest = () => {
    // Implement maintenance request logic
    console.log(`Requesting maintenance for ${device.name}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{device.name}</h2>
        <p><strong>Loại thiết bị:</strong> {device.type}</p>
        <p><strong>Mã thiết bị:</strong> {device.id}</p>
        <p><strong>Vị trí:</strong> {device.room}, {device.floor}</p>
        <p><strong>Trạng thái:</strong> {device.status}</p>
        <p><strong>Dữ liệu gần nhất:</strong> {device.latestData}</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Nhật ký hoạt động</h3>
          <ul className="list-disc pl-5">
            <li>09:00 17/08/2025: Bật bởi Admin</li>
            <li>10:00 17/08/2025: Tắt bởi System</li>
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Tình trạng bảo trì</h3>
          <p>Trạng thái: {device.status === 'maintenance' ? 'Đang bảo trì' : 'Đang hoạt động'}</p>
          <button
            onClick={handleMaintenanceRequest}
            className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
          >
            Đánh dấu cần bảo trì
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 text-white px-3 py-1 rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default DeviceDetailsModal;