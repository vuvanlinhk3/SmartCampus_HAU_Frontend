import { useState, useEffect } from 'react';
import { Schedule, BookingFormData } from '../types';
import { schedules as initialSchedules } from '../data/mockData';

export const useScheduleData = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  const addSchedule = (bookingData: BookingFormData) => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      roomId: bookingData.roomId,
      timeSlotId: bookingData.timeSlotId,
      date: bookingData.date,
      subject: bookingData.subject,
      instructor: bookingData.instructor,
      studentCount: bookingData.studentCount,
      phone: bookingData.phone,
      studentId: bookingData.studentId,
      purpose: bookingData.purpose,
      createdBy: 'current-user', // In real app, this would be from auth
      createdAt: new Date().toISOString()
    };

    setSchedules(prev => [...prev, newSchedule]);
  };

  const updateSchedule = (scheduleId: string, bookingData: BookingFormData) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? {
              ...schedule,
              roomId: bookingData.roomId,
              timeSlotId: bookingData.timeSlotId,
              date: bookingData.date,
              subject: bookingData.subject,
              instructor: bookingData.instructor,
              studentCount: bookingData.studentCount,
              phone: bookingData.phone,
              studentId: bookingData.studentId,
              purpose: bookingData.purpose
            }
          : schedule
      )
    );
  };

  const deleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
  };

  const canModifySchedule = (schedule: Schedule): boolean => {
    // In real app, check if current user is the creator or admin
    return true; // For demo purposes
  };

  return {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    canModifySchedule
  };
};