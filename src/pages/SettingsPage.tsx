import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import ThemeLanguageSection from '../components/Setting/ThemeLanguageSection';
import AccountSection from '../components/Setting/AccountSection';
import PasswordChangeModal from '../components/Setting/PasswordChangeModal';
import { apiClient, UserProfile, UpdateUserInfoDTO } from '../utils/api';
import { removeAuthData } from '../utils/token';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('vi');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getProfile();
        
        if (response.success && response.data) {
          setUserData(response.data);
        } else {
          setMessage({ type: 'error', text: response.message || 'Không thể tải thông tin người dùng' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Lỗi kết nối đến server' });
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveUserInfo = async (updateData: UpdateUserInfoDTO) => {
    try {
      setIsLoading(true);
      const response = await apiClient.updateUserInfo(updateData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công' });
        
        // Cập nhật lại userData với thông tin mới
        if (userData) {
          setUserData({
            ...userData,
            name: updateData.Name || userData.name,
            phone: updateData.Phone || userData.phone,
            email: updateData.Email || userData.email
          });
        }
        
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Cập nhật thất bại' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi khi cập nhật thông tin' });
      console.error('Error updating user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthData();
    window.location.href = '/login';
  };

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.changePassword({ OldPassword: oldPassword, NewPassword: newPassword });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Đổi mật khẩu thành công' });
        setShowPasswordModal(false);
        setTimeout(() => setMessage(null), 3000);
        return true;
      } else {
        setMessage({ type: 'error', text: response.message || 'Đổi mật khẩu thất bại' });
        return false;
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi khi đổi mật khẩu' });
      console.error('Error changing password:', error);
      return false;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <Settings className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-2xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Cài đặt hệ thống
            </h1>
          </div>
          <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Quản lý tùy chọn và thông tin tài khoản
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm ${
            message.type === 'error' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ThemeLanguageSection
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              language={language}
              setLanguage={setLanguage}
            />
            
            <AccountSection
              darkMode={darkMode}
              userData={userData}
              onSave={handleSaveUserInfo}
              onPasswordChange={() => setShowPasswordModal(true)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordChangeModal
          darkMode={darkMode}
          onClose={() => setShowPasswordModal(false)}
          onChangePassword={handlePasswordChange}
        />
      )}
    </div>
  );
};

export default SettingsPage;