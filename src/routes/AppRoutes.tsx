// AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Step1Email from '../pages/ForgotPassword/Step1Email';
import ResetPassword from '../pages/ResetPassword';
import RoomDetailPage from '../pages/RoomDetailsPage'; // Thêm import
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

export default function AppRoutes(): JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/forgot-password/step1" element={
            <PublicRoute>
              <Step1Email />
            </PublicRoute>
          } />
          <Route path="/reset-password" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />
          {/* Thêm route cho trang chi tiết phòng */}
          <Route path="/room/:roomName" element={
            <ProtectedRoute>
              <RoomDetailPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}