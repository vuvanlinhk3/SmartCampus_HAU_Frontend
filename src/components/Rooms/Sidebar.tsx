import React from 'react';
import { Building2, Map, Calendar, Wrench, BarChart2, Cog } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'rooms', label: 'Phòng học', icon: Building2 },
    { id: 'floor-plan', label: 'Sơ đồ tầng', icon: Map },
    { id: 'schedule', label: 'Thời khóa biểu', icon: Calendar },
    { id: 'equipment', label: 'Quản lý thiết bị', icon: Wrench },
    { id: 'statistics', label: 'Thống kê', icon: BarChart2 },
  ];

  return (
    <div className="fixed left-0 top-0 w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 h-20">
        <div className="flex items-center space-x-3 h-full">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">SmartCampus</h1>
            <p className="text-sm text-gray-500">Quản lý phòng học</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Settings and Account Section */}
      <div className="p-4">
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors mb-3 rounded-lg">
          <Cog className="w-5 h-5" />
          <span>Cài đặt</span>
        </button>
        <hr className="border-gray-200" />
        <div className="flex items-center space-x-3 mt-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Tài khoản</p>
            <p className="text-xs text-gray-500">admin@smartcampus</p>
          </div>
        </div>
      </div>
    </div>
  );
}