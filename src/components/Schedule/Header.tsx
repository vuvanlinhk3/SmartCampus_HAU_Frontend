import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Thời Khóa Biểu - Tòa M - HAU
            </h1>
            <p className="text-sm text-gray-500">
              Hệ thống quản lý phòng học
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="h-5 w-5" />
            <div>
              <div className="text-lg font-semibold font-mono">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};