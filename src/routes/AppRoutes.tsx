import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Step1Email from '../pages/ForgotPassword/Step1Email';
import Step2Code from '../pages/ForgotPassword/Step2Code';
import Step3Reset from '../pages/ForgotPassword/Step3Reset';

export default function AppRoutes(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password/step1" element={<Step1Email />} />
        <Route path="/forgot-password/step2" element={<Step2Code />} />
        <Route path="/forgot-password/step3" element={<Step3Reset />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}