// import React, { useState, useEffect } from 'react';
// import { X, User, Users, Phone, Car as IdCard, FileText, Calendar, Clock, MapPin } from 'lucide-react';
// import { BookingFormData, TimeSlot, Room } from '../../types/tkb';

// interface RoomBookingModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: BookingFormData) => void;
//   timeSlots: TimeSlot[];
//   rooms: Room[];
//   preselectedRoomId?: string;
//   preselectedTimeSlotId?: string;
//   selectedDate: string;
// }

// export const RoomBookingModal: React.FC<RoomBookingModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   timeSlots,
//   rooms,
//   preselectedRoomId,
//   preselectedTimeSlotId,
//   selectedDate
// }) => {
//   const [formData, setFormData] = useState<BookingFormData>({
//     instructor: '',
//     studentCount: 1,
//     phone: '',
//     studentId: '',
//     purpose: '',
//     date: selectedDate,
//     timeSlotId: preselectedTimeSlotId || '',
//     roomId: preselectedRoomId || '',
//     subject: ''
//   });

//   const [errors, setErrors] = useState<Partial<BookingFormData>>({});

//   useEffect(() => {
//     if (isOpen) {
//       setFormData(prev => ({
//         ...prev,
//         date: selectedDate,
//         timeSlotId: preselectedTimeSlotId || '',
//         roomId: preselectedRoomId || ''
//       }));
//     }
//   }, [isOpen, selectedDate, preselectedTimeSlotId, preselectedRoomId]);

//   const validateForm = (): boolean => {
//     const newErrors: Partial<BookingFormData> = {};

//     if (!formData.instructor.trim()) newErrors.instructor = 'Vui lòng nhập tên chủ phòng';
//     if (formData.studentCount < 1) newErrors.studentCount = 'Số lượng người phải lớn hơn 0';
//     if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
//     if (!formData.purpose.trim()) newErrors.purpose = 'Vui lòng nhập mục đích mượn phòng';
//     if (!formData.timeSlotId) newErrors.timeSlotId = 'Vui lòng chọn khung giờ';
//     if (!formData.roomId) newErrors.roomId = 'Vui lòng chọn phòng';
//     if (!formData.subject.trim()) newErrors.subject = 'Vui lòng nhập tên môn học/sự kiện';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onSubmit(formData);
//       onClose();
//       setFormData({
//         instructor: '',
//         studentCount: 1,
//         phone: '',
//         studentId: '',
//         purpose: '',
//         date: selectedDate,
//         timeSlotId: '',
//         roomId: '',
//         subject: ''
//       });
//       setErrors({});
//     }
//   };

//   const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: undefined
//       }));
//     }
//   };

//   if (!isOpen) return null;

//   const selectedRoom = rooms.find(r => r.id === formData.roomId);
//   const selectedTimeSlot = timeSlots.find(t => t.id === formData.timeSlotId);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">Đăng ký mượn phòng</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="h-5 w-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Subject */}
//           <div>
//             <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//               <FileText className="h-4 w-4" />
//               <span>Tên môn học/Sự kiện *</span>
//             </label>
//             <input
//               type="text"
//               value={formData.subject}
//               onChange={(e) => handleInputChange('subject', e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                 errors.subject ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="VD: Toán cao cấp A1, Họp nhóm đồ án..."
//             />
//             {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
//           </div>

//           {/* Instructor */}
//           <div>
//             <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//               <User className="h-4 w-4" />
//               <span>Tên chủ phòng *</span>
//             </label>
//             <input
//               type="text"
//               value={formData.instructor}
//               onChange={(e) => handleInputChange('instructor', e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                 errors.instructor ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="VD: TS. Nguyễn Văn A, Sinh viên Trần Thị B..."
//             />
//             {errors.instructor && <p className="text-red-500 text-xs mt-1">{errors.instructor}</p>}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Student Count */}
//             <div>
//               <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//                 <Users className="h-4 w-4" />
//                 <span>Số lượng người *</span>
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 value={formData.studentCount}
//                 onChange={(e) => handleInputChange('studentCount', parseInt(e.target.value) || 1)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                   errors.studentCount ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               />
//               {errors.studentCount && <p className="text-red-500 text-xs mt-1">{errors.studentCount}</p>}
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//                 <Phone className="h-4 w-4" />
//                 <span>Số điện thoại *</span>
//               </label>
//               <input
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) => handleInputChange('phone', e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                   errors.phone ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="0123456789"
//               />
//               {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//             </div>
//           </div>

//           {/* Student ID */}
//           <div>
//             <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//               <IdCard className="h-4 w-4" />
//               <span>Mã sinh viên (nếu là sinh viên)</span>
//             </label>
//             <input
//               type="text"
//               value={formData.studentId}
//               onChange={(e) => handleInputChange('studentId', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               placeholder="VD: SV2021001"
//             />
//           </div>

//           {/* Purpose */}
//           <div>
//             <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//               <FileText className="h-4 w-4" />
//               <span>Mục đích mượn phòng *</span>
//             </label>
//             <select
//               value={formData.purpose}
//               onChange={(e) => handleInputChange('purpose', e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                 errors.purpose ? 'border-red-500' : 'border-gray-300'
//               }`}
//             >
//               <option value="">Chọn mục đích</option>
//               <option value="Dạy học">Dạy học</option>
//               <option value="Học nhóm">Học nhóm</option>
//               <option value="Hội thảo">Hội thảo</option>
//               <option value="Sinh hoạt CLB">Sinh hoạt CLB</option>
//               <option value="Thi cử">Thi cử</option>
//               <option value="Khác">Khác</option>
//             </select>
//             {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Date */}
//             <div>
//               <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//                 <Calendar className="h-4 w-4" />
//                 <span>Ngày *</span>
//               </label>
//               <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) => handleInputChange('date', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               />
//             </div>

//             {/* Time Slot */}
//             <div>
//               <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//                 <Clock className="h-4 w-4" />
//                 <span>Khung giờ *</span>
//               </label>
//               <select
//                 value={formData.timeSlotId}
//                 onChange={(e) => handleInputChange('timeSlotId', e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                   errors.timeSlotId ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               >
//                 <option value="">Chọn giờ</option>
//                 {timeSlots.map((slot) => (
//                   <option key={slot.id} value={slot.id}>
//                     Tiết {slot.id}: {slot.startTime} - {slot.endTime}
//                   </option>
//                 ))}
//               </select>
//               {errors.timeSlotId && <p className="text-red-500 text-xs mt-1">{errors.timeSlotId}</p>}
//             </div>

//             {/* Room */}
//             <div>
//               <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//                 <MapPin className="h-4 w-4" />
//                 <span>Phòng *</span>
//               </label>
//               <select
//                 value={formData.roomId}
//                 onChange={(e) => handleInputChange('roomId', e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                   errors.roomId ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               >
//                 <option value="">Chọn phòng</option>
//                 {rooms.map((room) => (
//                   <option key={room.id} value={room.id}>
//                     {room.name} ({room.capacity} chỗ)
//                   </option>
//                 ))}
//               </select>
//               {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
//             </div>
//           </div>

//           {/* Selection Summary */}
//           {(selectedRoom || selectedTimeSlot) && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h4 className="font-semibold text-blue-800 mb-2">Thông tin đã chọn:</h4>
//               <div className="space-y-1 text-sm text-blue-700">
//                 {selectedRoom && (
//                   <p>📍 Phòng: {selectedRoom.name} (Sức chứa: {selectedRoom.capacity} người)</p>
//                 )}
//                 {selectedTimeSlot && (
//                   <p>⏰ Giờ: Tiết {selectedTimeSlot.id} ({selectedTimeSlot.startTime} - {selectedTimeSlot.endTime})</p>
//                 )}
//                 <p>📅 Ngày: {new Date(formData.date).toLocaleDateString('vi-VN')}</p>
//               </div>
//             </div>
//           )}

//           {/* Form Actions */}
//           <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Hủy
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
//             >
//               Đăng ký
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };