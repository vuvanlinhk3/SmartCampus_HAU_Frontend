import React, { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import AuthLayout from '../../layouts/AuthLayout';
import Card from '../../components/components/Card';
import InputField from '../../components/components/InputField';
import Button from '../../components/components/Button';

export default function Step1Email(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.forgotPassword(email);
      
      if (response.success) {
        setSuccess('Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và nhấp vào link để tiếp tục.');
      } else {
        setError(response.message || 'Không thể gửi email. Vui lòng thử lại.');
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
            Quên mật khẩu
          </h2>
          <p className="text-gray-600 text-sm">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
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

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập địa chỉ email"
            disabled={isLoading}
            required
          />

          <Button type="submit" className="w-full" disabled={isLoading || success !== ''}>
            {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại'}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            onClick={handleBackToLogin}
            className="inline-flex items-center text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại đăng nhập
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}