import { useState, useMemo } from 'react';
import { Room, Schedule, RoomType } from '../types';

export const useFilters = (rooms: Room[], schedules: Schedule[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('all');

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedRoomType === 'all' || room.type === selectedRoomType;
      
      return matchesSearch && matchesType;
    });
  }, [rooms, searchTerm, selectedRoomType]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => schedule.date === selectedDate);
  }, [schedules, selectedDate]);

  return {
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    selectedRoomType,
    setSelectedRoomType,
    filteredRooms,
    filteredSchedules
  };
};