import React from 'react';
import { MapPin, Users, Wifi, Coffee, Car, Building2 } from 'lucide-react';

interface FloorDiagramProps {
  floor: number;
}

const FloorDiagram: React.FC<FloorDiagramProps> = ({ floor }) => {
  // Mock data for different floor types
  const getFloorData = (floorNumber: number) => {
    if (floorNumber === 1) {
      return {
        title: 'Tầng Trệt - Sảnh Chính',
        image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
        description: 'Khu vực tiếp đón khách và dịch vụ chính',
        features: ['reception', 'cafe', 'parking', 'wifi']
      };
    } else if (floorNumber <= 5) {
      return {
        title: `Tầng ${floorNumber} - Văn Phòng`,
        image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1200',
        description: `Không gian làm việc với ${Math.floor(Math.random() * 50 + 100)} chỗ ngồi`,
        features: ['users', 'wifi', 'coffee']
      };
    } else {
      return {
        title: `Tầng ${floorNumber} - Căn Hộ`,
        image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
        description: `Khu vực sinh hoạt với ${Math.floor(Math.random() * 4 + 2)} căn hộ`,
        features: ['users', 'wifi']
      };
    }
  };

  const floorData = getFloorData(floor);

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'reception': return <MapPin className="w-4 h-4" />;
      case 'users': return <Users className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'coffee': return <Coffee className="w-4 h-4" />;
      case 'cafe': return <Coffee className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      default: return null;
    }
  };

  const getFeatureName = (feature: string) => {
    switch (feature) {
      case 'reception': return 'Lễ tân';
      case 'users': return 'Khu vực làm việc';
      case 'wifi': return 'WiFi';
      case 'coffee': return 'Cafe';
      case 'cafe': return 'Cafe';
      case 'parking': return 'Đỗ xe';
      default: return feature;
    }
  };

return (
  <div className="h-full flex flex-col bg-white">
    {/* Header */}
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{floorData.title}</h1>
            <p className="text-xs text-gray-600">{floorData.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {floorData.features.map((feature) => (
            <div key={feature} className="flex items-center gap-1 text-gray-600 px-2 py-1 text-xs">
              {getFeatureIcon(feature)}
              <span>{getFeatureName(feature)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Floor Plan Image chiếm toàn bộ phần còn lại */}
    <div className="flex-1 p-2 overflow-hidden">
      <img
        src={floorData.image}
        alt={`Sơ đồ ${floorData.title}`}
        className="w-full h-full object-contain"
      />
    </div>
  </div>
);

};

export default FloorDiagram;