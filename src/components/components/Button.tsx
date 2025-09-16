import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'link';
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = '',
  ...props 
}: ButtonProps): JSX.Element {
  const baseClasses = 'font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#005DAA] hover:bg-[#004a8c] text-white focus:ring-[#005DAA] disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
    link: 'text-[#005DAA] hover:text-[#004a8c] hover:underline bg-transparent p-0 focus:ring-0'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}