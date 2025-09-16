import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Edit, Save, X } from 'lucide-react';
import { UpdateUserInfoDTO, UserProfile } from '../../utils/api';

interface AccountSectionProps {
  darkMode: boolean;
  userData: UserProfile | null;
  onPasswordChange: () => void;
  onLogout: () => void;
  onSave: (updateData: UpdateUserInfoDTO) => Promise<void>;
}

const AccountSection: React.FC<AccountSectionProps> = ({ 
  darkMode, 
  userData,
  onPasswordChange, 
  onLogout,
  onSave
}) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: ''
  });
  const [originalUserData, setOriginalUserData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  useEffect(() => {
    if (userData) {
      const newUserData = {
        username: userData.userName,
        fullName: userData.name || '',
        email: userData.email,
        phone: userData.phone || ''
      };
      
      setFormData(newUserData);
      setOriginalUserData(newUserData);
      setIsLoading(false);
    }
  }, [userData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(originalUserData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updateData: UpdateUserInfoDTO = {
        Name: formData.fullName,
        Email: formData.email,
        Phone: formData.phone
      };

      await onSave(updateData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công' });
      setOriginalUserData(formData);
      setIsEditing(false);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi khi cập nhật thông tin' });
      console.error('Error updating user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className={`lg:col-span-2 rounded-lg p-5 transition-all duration-200 ${
        darkMode ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-gray-100/50'
      }`}>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-gray-500">Đang tải thông tin...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={`lg:col-span-2 rounded-lg p-5 transition-all duration-200 ${
      darkMode ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-gray-100/50'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-medium transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Thông tin tài khoản quản lý
        </h2>
        <button
          onClick={handleEditToggle}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isEditing ? <X size={16} /> : <Edit size={16} />}
          {isEditing ? 'Hủy' : 'Sửa'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'error' 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-xs font-medium mb-1.5 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Tên tài khoản
          </label>
          <input
            type="text"
            value={formData.username}
            readOnly
            className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-400' 
                : 'bg-gray-50 border-gray-300 text-gray-500'
            } cursor-not-allowed`}
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Họ và tên đầy đủ
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-lg border transition-all text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } ${
              isEditing 
                ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                : 'cursor-not-allowed'
            }`}
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-lg border transition-all text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } ${
              isEditing 
                ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                : 'cursor-not-allowed'
            }`}
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Số điện thoại
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-lg border transition-all text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } ${
              isEditing 
                ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                : 'cursor-not-allowed'
            }`}
          />
        </div>
      </div>

      {isEditing && (
        <div className="mt-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-400' 
                : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300'
            }`}
          >
            {isLoading ? (
              <>Đang lưu...</>
            ) : (
              <>
                <Save size={16} />
                Lưu thông tin
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className={`block text-xs font-medium mb-1.5 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Mật khẩu
          </label>
          <div className="flex gap-3">
            <input
              type="password"
              value="••••••••••"
              readOnly
              className={`flex-1 px-3 py-2 rounded-lg border transition-colors text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-500'
              } cursor-not-allowed`}
            />
            <button
              onClick={onPasswordChange}
              className={`px-4 py-2 rounded-lg border transition-all hover:shadow-sm focus:ring-2 focus:ring-blue-500 flex items-center gap-2 text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lock className="w-4 h-4" />
              Đổi
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all hover:shadow-sm focus:ring-2 focus:ring-red-500 text-sm ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-red-400 hover:bg-gray-700' 
                : 'bg-white border-gray-300 text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccountSection;