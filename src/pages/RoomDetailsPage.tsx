// src/pages/RoomDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  AirVent,
  Monitor,
  Zap,
  Fan,
  Camera,
  Calendar,
  Clock,
  Activity,
  AlertTriangle
} from 'lucide-react';
import Header from '../components/DetailRoom/Header';
import TitleSection from '../components/DetailRoom/TitleSection';
import Tabs from '../components/DetailRoom/Tabs';
import InfoTab from '../components/DetailRoom/InfoTab';
import ScheduleTab from '../components/DetailRoom/ScheduleTab';
import EquipmentTab from '../components/DetailRoom/EquipmentTab';
import { getRoomDetail, RoomDetail } from '../utils/apiDetailRoom';
import { getAllRoomsWithUnits, Unit, createUnit, updateUnit, deleteUnit } from '../utils/apiUnits';

type TabType = 'info' | 'schedule' | 'equipment';
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

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  instructor: string;
  duration: string;
}

const RoomDetailsPage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [roomData, setRoomData] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showEditEquipmentModal, setShowEditEquipmentModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [newEquipment, setNewEquipment] = useState({
    deviceType: '',
    deviceCode: '',
    status: true,
    detail: ''
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        if (roomName) {
          const data = await getRoomDetail(roomName);
          setRoomData(data);
          
          // Fetch equipment data
          const roomsWithUnits = await getAllRoomsWithUnits();
          const currentRoom = roomsWithUnits.find(room => room.roomName === roomName);
          
          if (currentRoom && currentRoom.units) {
            const equipmentData: Equipment[] = currentRoom.units.map(unit => ({
              id: unit.unitId.toString(),
              deviceType: unit.deviceType,
              deviceCode: unit.deviceCode,
              status: unit.status ? 'active' : 'maintenance',
              detail: unit.detail,
              isOn: unit.status,
              icon: getEquipmentIcon(unit.deviceType)
            }));
            setEquipment(equipmentData);
          }
          
          // Convert booking data to schedule events
          if (data.bookings) {
            const events = data.bookings.map(booking => ({
              id: booking.bookingId.toString(),
              title: booking.subject,
              date: new Date(booking.bookingDate).toLocaleDateString('vi-VN'),
              time: `${booking.startPeriod}:00`,
              instructor: booking.teacher,
              duration: `${booking.periods}h`
            }));
            setScheduleEvents(events);
          }
        }
      } catch (err) {
        setError('Không thể tải thông tin phòng. Vui lòng kiểm tra kết nối hoặc khởi động server.');
        console.error('Failed to fetch room details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomName]);

  const getEquipmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'air conditioner':
      case 'dieuhoa':
      case 'điều hòa':
        return <AirVent size={20} />;
      case 'monitor':
        return <Monitor size={20} />;
      case 'projector':
      case 'maychieu':
      case 'máy chiếu':
        return <Zap size={20} />;
      case 'fan':
      case 'quạt':
        return <Fan size={20} />;
      case 'camera':
      case 'camera giám sát':
        return <Camera size={20} />;
      case 'light':
      case 'den':
      case 'đèn':
        return <Zap size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const handleAddEquipment = async () => {
    try {
      if (!roomData) return;
      
      const unitData = {
        roomId: Number(roomData.roomId),
        deviceType: newEquipment.deviceType,
        deviceCode: newEquipment.deviceCode,
        status: newEquipment.status,
        detail: newEquipment.detail
      };
      
      await createUnit(unitData);
      
      // Refresh equipment list
      const roomsWithUnits = await getAllRoomsWithUnits();
      const currentRoom = roomsWithUnits.find(room => room.roomName === roomName);
      
      if (currentRoom && currentRoom.units) {
        const equipmentData: Equipment[] = currentRoom.units.map(unit => ({
          id: unit.unitId.toString(),
          deviceType: unit.deviceType,
          deviceCode: unit.deviceCode,
          status: unit.status ? 'active' : 'maintenance',
          detail: unit.detail,
          isOn: unit.status,
          icon: getEquipmentIcon(unit.deviceType)
        }));
        setEquipment(equipmentData);
      }
      
      setShowAddEquipmentModal(false);
      setNewEquipment({
        deviceType: '',
        deviceCode: '',
        status: true,
        detail: ''
      });
    } catch (error) {
      console.error('Failed to add equipment:', error);
      alert('Thêm thiết bị thất bại. Vui lòng thử lại.');
    }
  };

  const handleEditEquipment = async () => {
    try {
      if (!editingEquipment) return;
      
      const unitId = parseInt(editingEquipment.id);
      const apiStatus = editingEquipment.status === 'active';
      
      await updateUnit(unitId, {
        deviceType: editingEquipment.deviceType,
        deviceCode: editingEquipment.deviceCode,
        status: apiStatus,
        detail: editingEquipment.detail
      });
      
      // Update local state
      setEquipment(prev => prev.map(item => 
        item.id === editingEquipment.id 
          ? { 
              ...editingEquipment,
              isOn: editingEquipment.status === 'active'
            } 
          : item
      ));
      
      setShowEditEquipmentModal(false);
      setEditingEquipment(null);
    } catch (error) {
      console.error('Failed to edit equipment:', error);
      alert('Cập nhật thiết bị thất bại. Vui lòng thử lại.');
    }
  };

  const handleToggleEquipment = (id: string) => {
    // Frontend-only toggle - no API call
    setEquipment(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isOn: !item.isOn } 
        : item
    ));
  };

  const handleUpdateStatus = async (id: string, status: EquipmentStatus) => {
    try {
      const unitId = parseInt(id);
      const apiStatus = status === 'active';
      
      // Find the current equipment to get all its data
      const currentEquipment = equipment.find(item => item.id === id);
      if (!currentEquipment) return;
      
      await updateUnit(unitId, {
        deviceType: currentEquipment.deviceType,
        deviceCode: currentEquipment.deviceCode,
        status: apiStatus,
        detail: currentEquipment.detail
      });
      
      // Update local state
      setEquipment(prev => prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status: status,
              isOn: status === 'active'
            } 
          : item
      ));
    } catch (error) {
      console.error('Failed to update equipment status:', error);
      alert('Cập nhật trạng thái thiết bị thất bại. Vui lòng thử lại.');
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    try {
      const unitId = parseInt(id);
      await deleteUnit(unitId);
      
      // Update local state
      setEquipment(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      alert('Xóa thiết bị thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Đang tải thông tin phòng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-red-500 text-lg">{error || 'Không tìm thấy thông tin phòng'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TitleSection roomData={roomData} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'info' && <InfoTab roomData={roomData} />}
        {activeTab === 'schedule' && (
          <ScheduleTab
            showScheduleModal={showScheduleModal}
            setShowScheduleModal={setShowScheduleModal}
            roomData={roomData}
          />
        )}
        {activeTab === 'equipment' && (
          <EquipmentTab 
            equipment={equipment}
            onAddEquipment={() => setShowAddEquipmentModal(true)}
            onEditEquipment={(equip) => {
              setEditingEquipment(equip);
              setShowEditEquipmentModal(true);
            }}
            onToggleEquipment={handleToggleEquipment}
            onUpdateStatus={handleUpdateStatus}
            onDeleteEquipment={handleDeleteEquipment}
          />
        )}
      </div>

      {/* Add Equipment Modal */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm thiết bị mới</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại thiết bị</label>
                <input
                  type="text"
                  value={newEquipment.deviceType}
                  onChange={(e) => setNewEquipment({...newEquipment, deviceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ví dụ: Điều hòa, Đèn, Máy chiếu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã thiết bị</label>
                <input
                  type="text"
                  value={newEquipment.deviceCode}
                  onChange={(e) => setNewEquipment({...newEquipment, deviceCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ví dụ: AC001, LIGHT002"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={newEquipment.detail}
                  onChange={(e) => setNewEquipment({...newEquipment, detail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Mô tả thiết bị"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newEquipment.status}
                  onChange={(e) => setNewEquipment({...newEquipment, status: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Thiết bị đang hoạt động</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddEquipment}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Thêm thiết bị
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {showEditEquipmentModal && editingEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa thiết bị</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại thiết bị</label>
                <input
                  type="text"
                  value={editingEquipment.deviceType}
                  onChange={(e) => setEditingEquipment({...editingEquipment, deviceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ví dụ: Điều hòa, Đèn, Máy chiếu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã thiết bị</label>
                <input
                  type="text"
                  value={editingEquipment.deviceCode}
                  onChange={(e) => setEditingEquipment({...editingEquipment, deviceCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ví dụ: AC001, LIGHT002"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={editingEquipment.detail}
                  onChange={(e) => setEditingEquipment({...editingEquipment, detail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Mô tả thiết bị"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingEquipment.status === 'active'}
                  onChange={(e) => setEditingEquipment({
                    ...editingEquipment, 
                    status: e.target.checked ? 'active' : 'maintenance'
                  })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Thiết bị đang hoạt động</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditEquipmentModal(false);
                  setEditingEquipment(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleEditEquipment}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailsPage;