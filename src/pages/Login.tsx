// pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/components/Card';
import InputField from '../components/components/InputField';
import Button from '../components/components/Button';

export default function Login(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message?: string; email?: string } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const successMessage = location.state?.message;
  const from = location.state?.from?.pathname || "/";

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(username, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError({ message: result.message, email: result.email });
    }

    setIsLoading(false);
  };

  // Hiển thị loading nếu đang kiểm tra trạng thái đăng nhập
  if (authLoading) {
    return (
      <AuthLayout>
        <Card>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#005DAA] bg-opacity-10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#005DAA]" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập hệ thống</h2>
          <p className="text-gray-600 text-sm">Vui lòng nhập thông tin để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          {error?.message && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm">
              <p className="text-red-700 font-medium">{error.message}</p>
              {error.email && (
                <p className="mt-1 text-red-600 text-sm">
                  Email: <span className="font-semibold">{error.email}</span>
                </p>
              )}
            </div>
          )}

          <InputField
            label="Tên tài khoản"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên tài khoản"
            disabled={isLoading}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005DAA] focus:border-[#005DAA] outline-none transition-colors"
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/forgot-password/step1')} className="text-sm">
            Quên mật khẩu?
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}