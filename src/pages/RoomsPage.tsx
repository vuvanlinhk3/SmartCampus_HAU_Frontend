// src/pages/RoomsPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import BuildingOverview from '../components/Rooms/BuildingOverview';
import FilterBar from '../components/Rooms/FilterBar';
import FloorSection from '../components/Rooms/FloorSection';
import { getAllRooms } from '../utils/roomApi';
import { Room } from '../components/Rooms/RoomCard';

export default function RoomsPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        setAllRooms(data.floors.flatMap(floor => floor.rooms));
      } catch (err) {
        setError('Không thể tải dữ liệu phòng. Vui lòng kiểm tra kết nối hoặc khởi động server.');
        console.error('Failed to fetch rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Filter rooms based on search criteria
  const filteredRooms = useMemo(() => {
    return allRooms.filter(room => {
      const matchesSearch = !searchTerm || 
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.schedule?.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (room.schedule?.subject.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFloor = !selectedFloor || room.floor.toString() === selectedFloor;
      const matchesStatus = !selectedStatus || room.status === selectedStatus;
      
      return matchesSearch && matchesFloor && matchesStatus;
    });
  }, [allRooms, searchTerm, selectedFloor, selectedStatus]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const stats = allRooms.reduce((acc, room) => {
      if (room.status === 'empty') acc.empty++;
      else if (room.status === 'occupied') acc.occupied++;
      else if (room.status === 'maintenance') acc.maintenance++;
      return acc;
    }, { empty: 0, occupied: 0, maintenance: 0 });

    const total = stats.empty + stats.occupied + stats.maintenance;
    const utilizationRate = total > 0 ? Math.round((stats.occupied / total) * 100) : 0;

    return { ...stats, utilizationRate };
  }, [allRooms]);

  // Group filtered rooms by floor
  const roomsByFloor = useMemo(() => {
    const grouped: { [key: number]: Room[] } = {};
    filteredRooms.forEach(room => {
      if (!grouped[room.floor]) {
        grouped[room.floor] = [];
      }
      grouped[room.floor].push(room);
    });
    return grouped;
  }, [filteredRooms]);

  // Calculate stats for each floor
  const getFloorStats = (rooms: Room[]) => {
    return rooms.reduce((acc, room) => {
      if (room.status === 'empty') acc.empty++;
      else if (room.status === 'occupied') acc.occupied++;
      else if (room.status === 'maintenance') acc.maintenance++;
      return acc;
    }, { empty: 0, occupied: 0, maintenance: 0 });
  };

  if (loading) {
    return <div className="text-center py-12 bg-white rounded-lg"><p className="text-gray-500 text-lg">Đang tải dữ liệu...</p></div>;
  }

  if (error) {
    return <div className="text-center py-12 bg-white rounded-lg"><p className="text-red-500 text-lg">{error}</p></div>;
  }

  return (
    <div>
      {/* Building Overview */}
      <BuildingOverview stats={overallStats} />

      {/* Filter Bar */}
      <div className="p-6">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {/* Room Sections by Floor */}
        <div className="space-y-6">
          {Object.keys(roomsByFloor)
            .map(Number)
            .sort((a, b) => a - b)
            .map(floor => (
              <FloorSection
                key={floor}
                floor={floor}
                rooms={roomsByFloor[floor]}
                stats={getFloorStats(roomsByFloor[floor])}
              />
            ))}
          
          {Object.keys(roomsByFloor).length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}