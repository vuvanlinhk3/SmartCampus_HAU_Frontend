// Màu sắc và biến toàn cục
export const COLORS = {
  primary: '#005DAA',
  primaryHover: '#004a8c',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#111827'
  }
} as const;

export const UNIVERSITY_NAME = 'Trường Đại học Kiến trúc Hà Nội';

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  FORGOT_PASSWORD: {
    STEP1: '/forgot-password/step1',
    RESET: '/reset-password'
  }
} as const;