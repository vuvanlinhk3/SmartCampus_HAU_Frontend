import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Sidebar from '../components/Rooms/Sidebar';
import Header from '../components/Rooms/Header';
import { useCurrentTime } from '../hooks/useCurrentTime';
import RoomsPage from './RoomsPage';
import DeviceManagementPage from './DeviceManagementPage';

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rooms');
  const currentTime = useCurrentTime();

  const handleLogout = (): void => {
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
          {/* Header */}
          <Header currentTime={currentTime} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            {activeTab === 'rooms' && <RoomsPage />}
            {activeTab === 'equipment' && <DeviceManagementPage />}
          </main>
        </div>
      </div>
    </MainLayout>
  );
}