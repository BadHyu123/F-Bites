
import React from 'react';
import { Header } from '../../components/Header';
import { MapPin, Navigation, Construction } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export const MapScreen: React.FC = () => {
  const { userLocation } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Bản đồ Món ngon" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 border-4 border-teal-100 rounded-full animate-pulse"></div>
            <MapPin size={48} className="text-[#19454B]" />
        </div>
        
        <h2 className="text-xl font-bold text-[#19454B] mb-2">Bản đồ đang được nâng cấp</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed mb-6">
            Chúng tôi đang bảo trì hệ thống bản đồ để mang lại trải nghiệm tìm kiếm chính xác hơn. Vui lòng quay lại sau!
        </p>

        <div className="bg-gray-50 p-4 rounded-xl w-full max-w-xs border border-gray-200">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Vị trí hiện tại của bạn</p>
            <div className="flex items-center gap-2 text-[#19454B] font-bold justify-center">
                <Navigation size={16} fill="currentColor" />
                <span className="truncate">{userLocation.addressDisplay}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
