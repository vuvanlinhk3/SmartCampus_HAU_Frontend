import React from 'react';
import { Building, Clock } from 'lucide-react';

const Header: React.FC = () => {

  return (
<div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-white">
                Thống kê tình trạng phòng học & thiết bị – Tòa M
              </h1>
              <p className="text-blue-100 mt-1">
                Hệ thống quản lý thông minh SmartCampus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;