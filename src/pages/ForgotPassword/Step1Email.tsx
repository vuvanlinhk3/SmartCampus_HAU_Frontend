import React, { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Card from '../../components/Card';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export default function Step1Email(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (email.trim()) {
      // Store email in sessionStorage for next steps
      sessionStorage.setItem('resetEmail', email);
      navigate('/forgot-password/step2');
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
            Nhập email để nhận mã xác nhận
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập địa chỉ email"
            required
          />

          <Button type="submit" className="w-full">
            Gửi mã
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