
import React from 'react';
import { useApp } from '../../hooks/useApp';
import { Header, Button } from '../../components/Common';
import { User, Phone, Mail, ChevronRight, LogOut, MapPin, Heart, ShieldQuestion, Settings, Leaf, Recycle, Award, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BuyerProfile: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  const MenuItem = ({ icon: Icon, label, onClick, color = "text-gray-600" }: any) => (
    <button 
        onClick={onClick}
        className="w-full bg-white p-4 flex items-center justify-between active:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b last:border-none border-gray-100 group"
    >
        <div className="flex items-center gap-3">
            <Icon size={20} className={`${color} group-hover:scale-110 transition-transform`} />
            <span className="font-medium text-gray-800">{label}</span>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-[120px]">
      <div className="bg-[#19454B] pt-[calc(env(safe-area-inset-top)+3rem)] pb-28 px-4 rounded-b-[2.5rem] relative mb-20 shadow-md overflow-visible">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 rounded-b-[2.5rem] overflow-hidden">
            <Leaf className="absolute top-4 left-4 w-16 h-16 rotate-45" />
            <Recycle className="absolute bottom-4 right-4 w-24 h-24 -rotate-12" />
        </div>

        <div className="flex justify-between items-center text-white mb-2 relative z-10">
            <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Settings size={20} className="text-white"/></button>
        </div>
        
        <div className="absolute -bottom-16 left-4 right-4 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 z-20">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-[#19454B] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm shrink-0">
                {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                    <span className="text-2xl font-bold text-white">{user.name.charAt(0)}</span>
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <h2 className="font-bold text-xl text-[#19454B] truncate">{user.name}</h2>
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    {user.phone ? <Phone size={12} /> : <Mail size={12} />}
                    <span>{user.phone || user.email}</span>
                </div>
            </div>
            <div className="px-3 py-1 bg-[#FF7043] text-white text-xs font-bold rounded-full shadow-md whitespace-nowrap">
                Hiệp sĩ Cứu đói
            </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        <div>
            <h3 className="font-bold text-[#19454B] text-sm mb-3 flex items-center gap-2">
                <Leaf size={16} /> Hành trình Xanh của bạn
            </h3>
            <div className="bg-gradient-to-br from-[#19454B] to-teal-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <p className="text-teal-200 text-xs font-bold uppercase tracking-wider mb-1">Cấp bậc hiện tại</p>
                        <h4 className="text-2xl font-bold flex items-center gap-2">
                            <Award className="text-yellow-400" fill="currentColor" /> 
                            Hiệp sĩ Giải cứu
                        </h4>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-[#FF7043]">12</p>
                        <p className="text-[10px] text-teal-200">Món đã cứu</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1 text-green-300">
                            <Leaf size={14} /> <span className="text-xs font-bold">CO2 Giảm</span>
                        </div>
                        <p className="font-bold text-lg">6.5 kg</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                         <div className="flex items-center gap-2 mb-1 text-blue-300">
                            <Droplets size={14} /> <span className="text-xs font-bold">Tiết kiệm</span>
                        </div>
                        <p className="font-bold text-lg">350k</p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <h3 className="font-bold text-[#19454B] text-sm mb-2 ml-1">Tài khoản</h3>
            <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <MenuItem icon={User} label="Chỉnh sửa hồ sơ" onClick={() => {}} />
                <MenuItem icon={MapPin} label="Địa chỉ đã lưu" onClick={() => {}} />
                <MenuItem icon={Heart} label="Món ăn yêu thích" onClick={() => navigate('/buyer/wishlist')} color="text-[#FF7043]" />
            </div>
        </div>

        <div>
            <h3 className="font-bold text-[#19454B] text-sm mb-2 ml-1">Thông tin chung</h3>
            <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <MenuItem icon={ShieldQuestion} label="Trung tâm hỗ trợ" onClick={() => {}} />
                <MenuItem icon={Mail} label="Góp ý cho F-bites" onClick={() => {}} />
            </div>
        </div>

        <div className="pt-4">
            <button 
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors active:scale-[0.98]"
            >
                <LogOut size={20} />
                Đăng xuất
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Phiên bản 1.0.9 (Vietnam V9)</p>
        </div>
      </div>
    </div>
  );
};
