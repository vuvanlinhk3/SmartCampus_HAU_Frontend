import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  currentTime: string;
}

export default function Header({ currentTime }: HeaderProps) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-256px)] bg-white border-b border-gray-200 px-6 py-4 z-10 h-20">
      <div className="flex items-center justify-between h-full">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Nhập để tìm kiếm"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Header Title */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            SmartCampus_HAU - Hệ thống quản lý phòng học
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Cập nhật lúc</p>
            <p className="font-medium text-gray-700">{currentTime}</p>
          </div>
        </div>
      </div>
    </header>
  );
}