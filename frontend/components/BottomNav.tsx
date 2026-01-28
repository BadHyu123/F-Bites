
import React from 'react';
import { Home, ShoppingBag, User, Store, PlusCircle, ClipboardList, Map as MapIcon, BarChart2 } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context';

export const BottomNav: React.FC = () => {
  const { user, cart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // If no user, show Buyer nav by default (Guest Mode)
  const role = user?.role || 'BUYER';

  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!user) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  const NavItem = ({ to, icon: Icon, label, protectedLink }: { to: string, icon: any, label: string, protectedLink?: boolean }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={(e) => protectedLink && handleProtectedClick(e, to)}
        className={`relative flex flex-col items-center justify-end h-full pb-3 w-full transition-colors ${isActive ? 'text-[#19454B]' : 'text-gray-400 hover:text-gray-500'}`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
        <span className="text-[10px] font-medium leading-none">{label}</span>
      </Link>
    );
  };

  const BuyerNav = () => (
    <>
      <NavItem to="/buyer/home" icon={Home} label="Trang chủ" />
      <NavItem to="/buyer/map" icon={MapIcon} label="Bản đồ" />
      
      {/* Floating Cart Button - Uses Brand Color #19454B for consistency */}
      <div className="relative w-full h-full flex flex-col items-center justify-end pb-3">
        <Link 
            to="/buyer/cart" 
            onClick={(e) => handleProtectedClick(e, '/buyer/cart')}
            className="absolute -top-6 flex flex-col items-center group"
        >
            <div className={`p-3.5 rounded-full shadow-xl border-4 border-gray-50 transform transition-transform active:scale-95 ${location.pathname === '/buyer/cart' ? 'bg-[#FF7043]' : 'bg-[#19454B]'}`}>
                <ShoppingBag size={26} className="text-white" />
                {cart.length > 0 && (
                    <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white"></span>
                )}
            </div>
            <span className={`text-[10px] font-medium mt-1 ${location.pathname === '/buyer/cart' ? 'text-[#FF7043]' : 'text-gray-500'}`}>
                Giỏ hàng
            </span>
        </Link>
      </div>

      <NavItem to="/buyer/orders" icon={ClipboardList} label="Đơn hàng" protectedLink />
      <NavItem to="/buyer/profile" icon={User} label="Cá nhân" protectedLink />
    </>
  );

  const SellerNav = () => (
    <>
      <NavItem to="/seller/dashboard" icon={BarChart2} label="Thống kê" />
      <NavItem to="/seller/products" icon={Store} label="Món ăn" />
      
      {/* Floating Add Button */}
      <div className="relative w-full h-full flex flex-col items-center justify-end pb-3">
        <Link to="/seller/products/new" className="absolute -top-6 flex flex-col items-center">
             <div className="bg-[#19454B] p-3.5 rounded-full shadow-xl border-4 border-gray-50 active:scale-95 transition-transform text-white hover:bg-[#13353a]">
                <PlusCircle size={28} />
             </div>
             <span className="text-[10px] font-medium mt-1 text-gray-500">Đăng bán</span>
        </Link>
      </div>

      <NavItem to="/seller/orders" icon={ClipboardList} label="Đơn hàng" />
      <NavItem to="/seller/profile" icon={User} label="Cá nhân" />
    </>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[80px] z-40 pb-safe-area">
      <div className="flex justify-between items-end h-full px-2 max-w-md mx-auto">
        {role === 'BUYER' ? <BuyerNav /> : role === 'SELLER' ? <SellerNav /> : null}
      </div>
    </div>
  );
};
