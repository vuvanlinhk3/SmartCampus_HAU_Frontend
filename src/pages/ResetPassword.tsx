import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../utils/api';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/components/Card';
import Button from '../components/components/Button';

export default function ResetPassword(): JSX.Element {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    // Check if required parameters are present
    if (!email || !token) {
      setError('Link không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.');
    }
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!email || !token) {
      setError('Link không hợp lệ hoặc đã hết hạn.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.resetPassword({
        Email: email,
        Token: token,
        NewPassword: newPassword,
      });

      if (response.success) {
        setSuccess('Đổi mật khẩu thành công!');
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' }
          });
        }, 2000);
      } else {
        setError(response.message || 'Không thể đổi mật khẩu. Link có thể đã hết hạn.');
      }
    } catch (error) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = (): void => {
    navigate('/login');
  };

  const isPasswordValid = newPassword.length >= 6;
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && doPasswordsMatch && email && token;

  return (
    <AuthLayout>
      <Card>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#005DAA] bg-opacity-10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#005DAA]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đặt lại mật khẩu
          </h2>
          <p className="text-gray-600 text-sm">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
          {email && (
            <p className="text-[#005DAA] text-sm font-medium mt-1">
              {email}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005DAA] focus:border-[#005DAA] outline-none transition-colors"
                placeholder="Nhập mật khẩu mới"
                disabled={isLoading || success !== ''}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading || success !== ''}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {isPasswordValid && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {newPassword.length > 0 && !isPasswordValid && (
              <p className="text-red-500 text-xs mt-1">
                Mật khẩu phải có ít nhất 6 ký tự
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005DAA] focus:border-[#005DAA] outline-none transition-colors"
                placeholder="Nhập lại mật khẩu"
                disabled={isLoading || success !== ''}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading || success !== ''}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {doPasswordsMatch && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {confirmPassword.length > 0 && !doPasswordsMatch && (
              <p className="text-red-500 text-xs mt-1">
                Mật khẩu không khớp
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={!isFormValid || isLoading || success !== ''}
            className="w-full"
          >
            {isLoading ? 'Đang đặt lại mật khẩu...' : 'Đặt lại mật khẩu'}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            onClick={handleBackToLogin}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại đăng nhập
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}