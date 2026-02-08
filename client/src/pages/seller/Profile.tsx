
import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Button } from '../../components/Common';
import { 
    Phone, ChevronRight, LogOut, MapPin, 
    Lock, HelpCircle,
    Wallet, MessageSquare, Clock, Camera, Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SellerProfile: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  const MenuItem = ({ icon: Icon, label, onClick, color = "text-gray-600", badge, value }: any) => (
    <button 
        onClick={onClick}
        className="w-full bg-white p-4 flex items-center justify-between active:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b last:border-none border-gray-100 group"
    >
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('600', '50')}`}>
                <Icon size={18} className={`${color} group-hover:scale-110 transition-transform`} />
            </div>
            <span className="font-medium text-gray-800 text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="font-bold text-[#19454B] text-sm">{value}</span>}
            {badge && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span>}
            <ChevronRight size={16} className="text-gray-400" />
        </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-[100px]">
        <div className="relative bg-white pb-4 shadow-sm z-10 mb-6">
            <div className="h-40 w-full bg-gray-200 relative">
                <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
                    className="w-full h-full object-cover" 
                    alt="Cover"
                />
                <button className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
                    <Camera size={16} />
                </button>
            </div>

            <div className="px-4 relative">
                <div className="flex justify-between items-end -mt-10 mb-3">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative group">
                        {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                            <div className="w-full h-full bg-[#19454B] flex items-center justify-center text-white text-2xl font-bold">
                                {user.shopName?.charAt(0) || 'S'}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={20} className="text-white"/>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                        <div 
                            onClick={() => setIsOpen(!isOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors shadow-sm ${isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-600' : 'bg-gray-500'} animate-pulse`}></div>
                            <span className="text-xs font-bold">{isOpen ? 'Đang mở cửa' : 'Đã đóng cửa'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-xl font-bold text-[#19454B] flex items-center gap-2">
                        {user.shopName || "Cửa hàng của bạn"}
                    </h1>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <MapPin size={12} />
                        <span className="truncate max-w-[250px]">{user.shopAddress || "Chưa cập nhật địa chỉ"}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="px-4 space-y-6">
            
            <div>
                <h3 className="font-bold text-gray-400 text-xs uppercase mb-2 ml-1">Quản lý cửa hàng</h3>
                <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem 
                        icon={Clock} 
                        label="Thông tin & Giờ mở cửa" 
                        color="text-blue-600"
                        value="08:00 - 22:00"
                        onClick={() => {}} 
                    />
                    <MenuItem 
                        icon={Wallet} 
                        label="Ví người bán" 
                        color="text-green-600"
                        value="1.250.000đ"
                        onClick={() => {}} 
                    />
                    <MenuItem 
                        icon={MessageSquare} 
                        label="Quản lý đánh giá" 
                        color="text-orange-500"
                        badge="3 mới"
                        onClick={() => {}} 
                    />
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-400 text-xs uppercase mb-2 ml-1">Thiết bị & Tiện ích</h3>
                <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem 
                        icon={Printer} 
                        label="Kết nối máy in" 
                        color="text-purple-600"
                        onClick={() => alert("Đang tìm máy in...")} 
                    />
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-400 text-xs uppercase mb-2 ml-1">Tài khoản & Hỗ trợ</h3>
                <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <MenuItem icon={Lock} label="Đổi mật khẩu" onClick={() => {}} />
                    <MenuItem icon={HelpCircle} label="Trung tâm trợ giúp" onClick={() => {}} />
                    <MenuItem icon={Phone} label="Liên hệ tổng đài" onClick={() => {}} />
                </div>
            </div>

            <div className="pt-2">
                <Button 
                    variant="danger" 
                    fullWidth 
                    className="h-12 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-200 border-none flex items-center justify-center gap-2 uppercase tracking-wide"
                    onClick={handleLogout}
                >
                    <LogOut size={18} /> ĐĂNG XUẤT
                </Button>
                <p className="text-center text-[10px] text-gray-400 mt-4">F-bites Partner App v1.13.0</p>
            </div>
        </div>
    </div>
  );
};
