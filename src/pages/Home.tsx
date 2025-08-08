import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';

export default function Home(): JSX.Element {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Chào mừng đến với hệ thống
          </h1>
          <p className="text-gray-600 mb-8">
            Bạn đã đăng nhập thành công vào hệ thống của trường.
          </p>
          <Button onClick={handleLogout} variant="secondary">
            Đăng xuất
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}