// ScheduleModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { addBooking, updateBooking, CreateBookingRequest, Booking } from '../utils/apiDetailRoom';

interface ScheduleModalProps {
  setShowScheduleModal: (show: boolean) => void;
  roomId: string;
  editingBooking: Booking | null;
  onBookingAdded: () => void;
  onBookingUpdated: () => void;
  onCancel: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ 
  setShowScheduleModal, 
  roomId, 
  editingBooking,
  onBookingAdded,
  onBookingUpdated,
  onCancel
}) => {
  const [formData, setFormData] = useState<CreateBookingRequest>({
    roomId: parseInt(roomId),
    className: '',
    subject: '',
    teacher: '',
    registeredBy: '',
    bookingDate: '',
    startPeriod: 1,
    periods: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form when editing an existing booking
  useEffect(() => {
    if (editingBooking) {
      setFormData({
        roomId: editingBooking.roomId,
        className: editingBooking.className || '',
        subject: editingBooking.subject,
        teacher: editingBooking.teacher,
        registeredBy: editingBooking.registeredBy,
        bookingDate: editingBooking.bookingDate.split('T')[0],
        startPeriod: editingBooking.startPeriod,
        periods: editingBooking.periods
      });
    }
  }, [editingBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingBooking) {
        await updateBooking(editingBooking.bookingId, formData);
        onBookingUpdated();
      } else {
        await addBooking(formData);
        onBookingAdded();
      }
      setShowScheduleModal(false);
    } catch (err) {
      setError(editingBooking 
        ? 'Không thể cập nhật lịch. Vui lòng thử lại.' 
        : 'Không thể đăng ký lịch. Vui lòng thử lại.');
      console.error('Failed to save booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roomId' || name === 'startPeriod' || name === 'periods' 
        ? parseInt(value) 
        : value
    }));
  };

  const handleClose = () => {
    setShowScheduleModal(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editingBooking ? 'Chỉnh sửa lịch' : 'Đăng ký lịch mới'}
          </h2>
          <button onClick={handleClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Môn học
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giáo viên
            </label>
            <input
              type="text"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người đăng ký
            </label>
            <input
              type="text"
              name="registeredBy"
              value={formData.registeredBy}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày đăng ký
            </label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiết bắt đầu
            </label>
            <select
              name="startPeriod"
              value={formData.startPeriod}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {[...Array(16)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tiết {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiết
            </label>
            <select
              name="periods"
              value={formData.periods}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {[...Array(16)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} tiết
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-500 text-white rounded disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : (editingBooking ? 'Cập nhật' : 'Đăng ký')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;