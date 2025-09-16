import React from 'react';
import { Home, Users, Wrench, Monitor, CheckCircle, AlertCircle } from 'lucide-react';
import { Room, Equipment } from '../../types';

interface StatCardsProps {
  rooms: Room[];
  equipment: Equipment[];
}

const StatCards: React.FC<StatCardsProps> = ({ rooms, equipment }) => {
  // Kiểm tra nếu không có dữ liệu
  if (rooms.length === 0 && equipment.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center mb-8">
        <div className="text-gray-500 text-lg">Không có dữ liệu</div>
        <p className="text-gray-400 mt-2">Không tìm thấy dữ liệu phòng học hoặc thiết bị</p>
      </div>
    );
  }

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
  const vacantRooms = rooms.filter(room => room.status === 'vacant').length;
  const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;

  const totalEquipment = equipment.length;
  const workingEquipment = equipment.filter(eq => eq.status === 'working').length;
  const brokenEquipment = equipment.filter(eq => eq.status === 'broken' || eq.status === 'maintenance').length;

  const stats = [
    {
      title: 'Tổng số phòng học',
      value: totalRooms,
      icon: Home,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      show: true
    },
    {
      title: 'Phòng đang sử dụng',
      value: occupiedRooms,
      subtitle: totalRooms > 0 ? `${((occupiedRooms / totalRooms) * 100).toFixed(1)}%` : '0%',
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      show: true
    },
    {
      title: 'Phòng đang trống',
      value: vacantRooms,
      subtitle: totalRooms > 0 ? `${((vacantRooms / totalRooms) * 100).toFixed(1)}%` : '0%',
      icon: Home,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      show: true
    },
    {
      title: 'Phòng bảo trì',
      value: maintenanceRooms,
      subtitle: totalRooms > 0 ? `${((maintenanceRooms / totalRooms) * 100).toFixed(1)}%` : '0%',
      icon: Wrench,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      show: true
    },
    {
      title: 'Tổng thiết bị',
      value: totalEquipment,
      icon: Monitor,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      show: equipment.length > 0
    },
    {
      title: 'Thiết bị hoạt động',
      value: workingEquipment,
      subtitle: totalEquipment > 0 ? `${((workingEquipment / totalEquipment) * 100).toFixed(1)}%` : '0%',
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      show: equipment.length > 0
    },
    {
      title: 'Thiết bị hỏng/bảo trì',
      value: brokenEquipment,
      subtitle: totalEquipment > 0 ? `${((brokenEquipment / totalEquipment) * 100).toFixed(1)}%` : '0%',
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      show: equipment.length > 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        stat.show && (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                  {stat.title}
                </p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className={`text-sm font-medium ${stat.textColor} opacity-70`}>
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default StatCards;