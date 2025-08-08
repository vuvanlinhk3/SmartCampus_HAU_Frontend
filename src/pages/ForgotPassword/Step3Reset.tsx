import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function Step3Reset(): JSX.Element {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user came from previous steps
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      navigate('/forgot-password/step1');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      // Clear stored email
      sessionStorage.removeItem('resetEmail');
      // Navigate back to login
      navigate('/login');
    }
  };

  const handleBackToLogin = (): void => {
    sessionStorage.removeItem('resetEmail');
    navigate('/login');
  };

  const isPasswordValid = newPassword.length >= 6;
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && doPasswordsMatch;

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
            Đổi mật khẩu mới
          </h2>
          <p className="text-gray-600 text-sm">
            Tạo mật khẩu mới để bảo mật tài khoản
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
            disabled={!isFormValid}
            className="w-full"
          >
            Đổi mật khẩu
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