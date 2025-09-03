import React, { useState } from 'react';
import FilterPanel from '../components/Devices/FilterPanel';
import DeviceGrid from '../components/Devices/DeviceGrid';
import DeviceDetailsModal from '../components/Devices/DeviceDetailsModal';

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

const DeviceManagementPage: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    floor: '',
    room: '',
    type: '',
    status: '',
  });

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Sample data (replace with API call in production)
  const devices: Device[] = [
    {
      id: '1',
      name: 'Đèn Sảnh 1',
      type: 'light',
      room: 'Sảnh',
      floor: 'Tầng 1',
      status: 'on',
      latestData: 'Đang sáng - 50W',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Máy lạnh P101',
      type: 'ac',
      room: 'Phòng 101',
      floor: 'Tầng 1',
      status: 'off',
      latestData: '25°C',
      image: 'https://via.placeholder.com/150',
    },
  ];

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredDevices = devices.filter(device => {
    return (
      (filters.search === '' || device.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.floor === '' || device.floor === filters.floor) &&
      (filters.room === '' || device.room === filters.room) &&
      (filters.type === '' || device.type === filters.type) &&
      (filters.status === '' || device.status === filters.status)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <FilterPanel onFilterChange={handleFilterChange} />
      <DeviceGrid devices={filteredDevices} onDeviceClick={setSelectedDevice} />
      {selectedDevice && (
        <DeviceDetailsModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />
      )}
    </div>
  );
};

export default DeviceManagementPage;