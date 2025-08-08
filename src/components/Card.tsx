import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps): JSX.Element {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      {children}
    </div>
  );
}