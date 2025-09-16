import React from 'react';
import { X, Edit3, Trash2, User, Users, Phone, Car as IdCard, FileText, Calendar, Clock, MapPin } from 'lucide-react';
import { Schedule, TimeSlot, Room } from '../../types/tkb';

interface ScheduleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  timeSlot: TimeSlot | undefined;
  room: Room | undefined;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  canModify: boolean;
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({
  isOpen,
  onClose,
  schedule,
  timeSlot,
  room,
  onEdit,
  onDelete,
  canModify
}) => {
  if (!isOpen || !schedule || !timeSlot || !room) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    onEdit(schedule);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch này không?')) {
      onDelete(schedule);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết lịch sử dụng phòng</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Schedule Details */}
        <div className="p-6 space-y-4">
          {/* Subject */}
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Môn học/Sự kiện</p>
              <p className="font-semibold text-gray-900">{schedule.subject}</p>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Chủ phòng</p>
              <p className="font-semibold text-gray-900">{schedule.instructor}</p>
            </div>
          </div>

          {/* Room & Time Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Phòng</p>
                <p className="font-semibold text-gray-900">
                  {room.name} (Sức chứa: {room.capacity} người)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-semibold text-gray-900">
                  Tiết {timeSlot.id}: {timeSlot.startTime} - {timeSlot.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Ngày</p>
                <p className="font-semibold text-gray-900">{formatDate(schedule.date)}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Số người tham gia</p>
                <p className="font-semibold text-gray-900">{schedule.studentCount} người</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Liên hệ</p>
                <p className="font-semibold text-gray-900">{schedule.phone}</p>
              </div>
            </div>
          </div>

          {schedule.studentId && (
            <div className="flex items-start space-x-3">
              <IdCard className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Mã sinh viên</p>
                <p className="font-semibold text-gray-900">{schedule.studentId}</p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Mục đích</p>
              <p className="font-semibold text-gray-900">{schedule.purpose}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {canModify && (
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Xóa</span>
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Chỉnh sửa</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};