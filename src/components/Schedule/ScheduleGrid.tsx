import React from 'react';
import { Plus } from 'lucide-react';
import { TimeSlot, Room, Schedule } from '../../types/tkb';

interface ScheduleGridProps {
  timeSlots: TimeSlot[];
  rooms: Room[];
  schedules: Schedule[];
  selectedDate: string;
  onCellClick: (roomId: string, timeSlotId: string) => void;
  onScheduleClick: (schedule: Schedule) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  timeSlots,
  rooms,
  schedules,
  selectedDate,
  onCellClick,
  onScheduleClick
}) => {
  const getScheduleForCell = (roomId: string, timeSlotId: string) => {
    return schedules.find(
      s => s.roomId === roomId && s.timeSlotId === timeSlotId && s.date === selectedDate
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-[120px_repeat(15,_minmax(120px,_1fr))] bg-gray-50 border-b border-gray-200">
            <div className="p-4 font-semibold text-gray-700 border-r border-gray-200">
              Phòng/Giờ
            </div>
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-4 text-center border-r border-gray-200 last:border-r-0"
              >
                <div className="font-semibold text-gray-700 text-xs">
                  Tiết {slot.id}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
            ))}
          </div>

          {/* Room Rows */}
          {rooms.map((room) => (
            <div
              key={room.id}
              className="grid grid-cols-[120px_repeat(15,_minmax(120px,_1fr))] border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              {/* Room Name Cell */}
              <div className="p-4 border-r border-gray-200 bg-gray-50">
                <div className="font-semibold text-gray-700">{room.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {room.capacity} chỗ
                </div>
                <div className="text-xs text-blue-600">
                  {room.type === 'theory' && 'Lý thuyết'}
                  {room.type === 'computer' && 'Máy tính'}
                  {room.type === 'auditorium' && 'Hội trường'}
                  {room.type === 'lab' && 'Thí nghiệm'}
                </div>
              </div>

              {/* Time Slot Cells */}
              {timeSlots.map((slot) => {
                const schedule = getScheduleForCell(room.id, slot.id);
                
                return (
                  <div
                    key={`${room.id}-${slot.id}`}
                    className="p-2 border-r border-gray-200 last:border-r-0 min-h-[80px] relative group"
                  >
                    {schedule ? (
                      <div
                        onClick={() => onScheduleClick(schedule)}
                        className="bg-green-100 border border-green-300 rounded-lg p-3 h-full cursor-pointer hover:bg-green-200 transition-colors"
                      >
                        <div className="text-sm font-semibold text-green-800 mb-1 truncate">
                          {schedule.subject}
                        </div>
                        <div className="text-xs text-green-600 truncate">
                          {schedule.instructor}
                        </div>
                        <div className="text-xs text-green-500 mt-1">
                          {schedule.studentCount} người
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => onCellClick(room.id, slot.id)}
                        className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                      >
                        <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};