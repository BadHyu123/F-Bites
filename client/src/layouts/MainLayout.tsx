
import React from 'react';
import { BottomNav } from '../components/BottomNav';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative">
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};
