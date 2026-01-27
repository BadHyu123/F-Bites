
import React from 'react';
import { BottomNav } from '../components/BottomNav';
import { useApp } from '../hooks/useApp';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  
  // Nếu là Admin, sử dụng layout full màn hình Desktop
  if (user?.role === 'ADMIN') {
    return (
      <div className="flex h-screen w-full bg-[#F0F2F5] overflow-hidden">
        {children}
      </div>
    );
  }

  // Layout Mobile cho Buyer và Seller: 
  // Căn giữa khung 'max-w-md' trên nền xám nhẹ để tạo cảm giác App thực tế
  return (
    <div className="w-full h-screen bg-[#F0F2F5] flex justify-center overflow-hidden">
      <div className="flex flex-col h-full w-full max-w-[450px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
        {/* Vùng nội dung cuộn */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-gray-50">
          {children}
        </div>
        
        {/* Điều hướng đáy cố định trong khung mobile */}
        <div className="shrink-0 z-50">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};
