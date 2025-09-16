// import React, { useState } from 'react';
// import { Header } from '../components/Schedule/Header';
// import { SearchFilterBar } from '../components/Schedule/SearchFilterBar';
// import { ScheduleGrid } from '../components/Schedule/ScheduleGrid';
// import { RoomBookingModal } from '../components/Schedule/RoomBookingModal';
// import { ScheduleDetailsModal } from '../components/Schedule/ScheduleDetailsModal';
// import { useScheduleData } from '../hooks/useScheduleData';
// import { useFilters } from '../hooks/useFilters';
// import { timeSlots, rooms } from '../data/tkbData';
// import { Schedule, BookingFormData } from '../types/tkb';

// export const SchedulePage: React.FC = () => {
//   const {
//     schedules,
//     addSchedule,
//     updateSchedule,
//     deleteSchedule,
//     canModifySchedule
//   } = useScheduleData();

//   const {
//     searchTerm,
//     setSearchTerm,
//     selectedDate,
//     setSelectedDate,
//     selectedRoomType,
//     setSelectedRoomType,
//     filteredRooms,
//     filteredSchedules
//   } = useFilters(rooms, schedules);

//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
//   const [preselectedRoomId, setPreselectedRoomId] = useState<string>('');
//   const [preselectedTimeSlotId, setPreselectedTimeSlotId] = useState<string>('');
//   const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

//   const handleCellClick = (roomId: string, timeSlotId: string) => {
//     setPreselectedRoomId(roomId);
//     setPreselectedTimeSlotId(timeSlotId);
//     setEditingSchedule(null);
//     setIsBookingModalOpen(true);
//   };

//   const handleAddScheduleClick = () => {
//     setPreselectedRoomId('');
//     setPreselectedTimeSlotId('');
//     setEditingSchedule(null);
//     setIsBookingModalOpen(true);
//   };

//   const handleScheduleClick = (schedule: Schedule) => {
//     setSelectedSchedule(schedule);
//     setIsDetailsModalOpen(true);
//   };

//   const handleScheduleSubmit = (data: BookingFormData) => {
//     if (editingSchedule) {
//       updateSchedule(editingSchedule.id, data);
//     } else {
//       addSchedule(data);
//     }
//   };

//   const handleEditSchedule = (schedule: Schedule) => {
//     setEditingSchedule(schedule);
//     setPreselectedRoomId(schedule.roomId);
//     setPreselectedTimeSlotId(schedule.timeSlotId);
//     setIsBookingModalOpen(true);
//   };

//   const handleDeleteSchedule = (schedule: Schedule) => {
//     deleteSchedule(schedule.id);
//   };

//   const selectedScheduleTimeSlot = selectedSchedule 
//     ? timeSlots.find(t => t.id === selectedSchedule.timeSlotId)
//     : undefined;

//   const selectedScheduleRoom = selectedSchedule 
//     ? rooms.find(r => r.id === selectedSchedule.roomId)
//     : undefined;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
      
//       <SearchFilterBar
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedDate={selectedDate}
//         setSelectedDate={setSelectedDate}
//         selectedRoomType={selectedRoomType}
//         setSelectedRoomType={setSelectedRoomType}
//         onAddSchedule={handleAddScheduleClick}
//       />

//       <main className="p-6">
//         <ScheduleGrid
//           timeSlots={timeSlots}
//           rooms={filteredRooms}
//           schedules={filteredSchedules}
//           selectedDate={selectedDate}
//           onCellClick={handleCellClick}
//           onScheduleClick={handleScheduleClick}
//         />
//       </main>

//       <RoomBookingModal
//         isOpen={isBookingModalOpen}
//         onClose={() => setIsBookingModalOpen(false)}
//         onSubmit={handleScheduleSubmit}
//         timeSlots={timeSlots}
//         rooms={rooms}
//         preselectedRoomId={preselectedRoomId}
//         preselectedTimeSlotId={preselectedTimeSlotId}
//         selectedDate={selectedDate}
//       />

//       <ScheduleDetailsModal
//         isOpen={isDetailsModalOpen}
//         onClose={() => setIsDetailsModalOpen(false)}
//         schedule={selectedSchedule}
//         timeSlot={selectedScheduleTimeSlot}
//         room={selectedScheduleRoom}
//         onEdit={handleEditSchedule}
//         onDelete={handleDeleteSchedule}
//         canModify={selectedSchedule ? canModifySchedule(selectedSchedule) : false}
//       />
//     </div>
//   );
// };