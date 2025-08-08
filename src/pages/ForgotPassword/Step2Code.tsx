import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function Step2Code(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      navigate('/forgot-password/step1');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (code.trim().length >= 6) {
      navigate('/forgot-password/step3');
    }
  };

  const handleResendCode = (): void => {
    setTimeLeft(60);
    // Logic to resend code
  };

  const handleBackToLogin = (): void => {
    sessionStorage.removeItem('resetEmail');
    navigate('/login');
  };

  return (
    <AuthLayout>
      <Card>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#005DAA] bg-opacity-10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#005DAA]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Xác nhận mã
          </h2>
          <p className="text-gray-600 text-sm">
            Mã xác nhận đã được gửi đến email
          </p>
          <p className="text-[#005DAA] text-sm font-medium mt-1">
            {email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã xác nhận
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005DAA] focus:border-[#005DAA] outline-none transition-colors text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={code.length < 6}
            className="w-full"
          >
            Xác nhận
          </Button>
        </form>

        {/* Resend Code Link */}
        <div className="mt-6 text-center">
          {timeLeft > 0 ? (
            <p className="text-gray-500 text-sm">
              Gửi lại mã sau {timeLeft}s
            </p>
          ) : (
            <Button 
              variant="link" 
              onClick={handleResendCode}
              className="text-sm"
            >
              Gửi lại mã
            </Button>
          )}
        </div>

        {/* Back to Login Link */}
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            onClick={handleBackToLogin}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại đăng nhập
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}