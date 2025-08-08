import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function Login(): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { username, password });
    // Navigate to home page after successful login
    navigate('/');
  };

  const handleForgotPassword = (): void => {
    navigate('/forgot-password/step1');
  };

  return (
    <AuthLayout>
      <Card>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#005DAA] bg-opacity-10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#005DAA]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng nhập hệ thống
          </h2>
          <p className="text-gray-600 text-sm">
            Vui lòng nhập thông tin để tiếp tục
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Tên tài khoản"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên tài khoản"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005DAA] focus:border-[#005DAA] outline-none transition-colors"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            onClick={handleForgotPassword}
            className="text-sm"
          >
            Quên mật khẩu?
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}