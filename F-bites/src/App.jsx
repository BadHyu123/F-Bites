import React from 'react';
import { 
  MapPin, Bell, Search, Leaf, Star, 
  Home, Map as MapIcon, ShoppingBag, ClipboardList, User,
  Clock 
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from './data';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function App() {
  return (
    <div className="min-h-screen bg-[#EEF2F6] flex justify-center items-center font-sans py-4">
      
      <div className="w-full md:w-[420px] h-[880px] bg-[#FAFAFA] md:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col border-[6px] border-white">
        
        <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
          
          {/* HEADER SECTION */}
          <div className="bg-primary pt-8 pb-16 px-5 rounded-b-[2.5rem] relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider ml-1">
                  VỊ TRÍ HIỆN TẠI
                </span>
                <div className="flex items-center gap-2 bg-[#224e53] px-3 py-2 rounded-xl cursor-pointer bg-opacity-90 hover:bg-[#2a5d63] transition-colors">
                  <MapPin size={16} className="text-accent" />
                  <span className="text-white text-[13px] font-medium truncate max-w-[150px]">
                    Bến Nghé, Quận 1, ...
                  </span>
                  <span className="text-gray-300 text-[10px]">▼</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="relative group cursor-pointer">
                  <Bell size={24} className="text-gray-300/90 group-hover:text-white transition-colors" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary"></span>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#3a6368] flex items-center justify-center text-white text-sm font-bold border border-[#4a7277]">
                  U
                </div>
              </div>
            </div>

            <h1 className="text-white text-[28px] font-extrabold leading-[1.2] mb-5 tracking-tight">
              Đừng để món ngon<br/>
              <span className="text-accent">Bị bỏ phí hôm nay!</span>
            </h1>

            <div className="relative mb-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Tìm món ngon giải cứu..." 
                className="w-full bg-[#254E54] text-white placeholder-gray-400/70 py-4 pl-12 pr-4 rounded-2xl outline-none text-sm shadow-inner focus:ring-1 focus:ring-accent/50 transition-all"
              />
            </div>
            
            <div className="absolute -bottom-[40px] left-4 right-4 bg-[#15383D] p-4 rounded-2xl flex items-center gap-4 shadow-xl z-20 border border-[#1e454b]">
              <div className="w-11 h-11 rounded-full bg-emerald-900/30 flex items-center justify-center flex-shrink-0 border border-emerald-800/50">
                <Leaf size={22} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Cộng đồng F-bites tuần này</p>
                <p className="text-white text-sm font-bold">🌱 Đã giải cứu <span className="text-accent text-base">1,250kg</span> thực phẩm</p>
              </div>
            </div>
          </div>

          <div className="h-12"></div>

          {/* CATEGORIES */}
          <div className="px-5 mb-7">
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  className={`
                    px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all
                    ${cat.active 
                      ? 'bg-primary text-white shadow-lg shadow-teal-900/20 transform scale-105' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 shadow-sm'}
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 mb-5 flex justify-between items-end">
            <div>
              <h2 className="text-[19px] font-extrabold text-gray-900 leading-none mb-1.5">Đang cần giải cứu</h2>
              <p className="text-xs text-gray-500 font-medium">Giảm lãng phí, tiết kiệm chi phí</p>
            </div>
            <div className="flex items-center gap-1.5 text-accent text-[11px] font-bold uppercase tracking-wide bg-[#FFF4F1] px-2.5 py-1.5 rounded-lg border border-orange-100">
              <span>🕒 Sắp hết hạn!</span>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="px-5 grid grid-cols-2 gap-4">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white rounded-[20px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                
                {/* Image */}
                <div className="relative rounded-xl overflow-hidden aspect-square mb-3">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-accent text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                    -{product.discount}%
                  </span>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-[10px] font-bold">{product.rating}</span>
                  </div>
                </div>

                {/* Eco Tag */}
                <div className="bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-bold px-2 py-1 rounded-md w-max mb-2 flex items-center gap-1">
                  <Leaf size={10} />
                  Giảm ~{product.co2}kg CO2
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-1">
                    <h3 className="text-[14px] font-extrabold text-gray-800 line-clamp-2 leading-tight mb-1">
                    {product.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium truncate mb-2">{product.shopName}</p>

                    {/* Price & Status Footer */}
                    <div className="mt-auto pt-2 border-t border-dashed border-gray-100">
                        <p className="text-[10px] text-gray-400 line-through font-medium mb-0.5">
                            {formatCurrency(product.originalPrice)}
                        </p>
                        
                        {/* Thay đổi: Dùng flex-wrap nếu cần, nhưng quan trọng nhất là bỏ max-w */}
                        <div className="flex justify-between items-center gap-1">
                            <p className="text-accent text-[16px] font-extrabold leading-none whitespace-nowrap">
                            {formatCurrency(product.salePrice)}
                            </p>
                            
                            {/* --- LOGIC HIỂN THỊ ĐÃ SỬA --- */}
                            {product.isSoldOut ? (
                                <span className="text-[9px] text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
                                    Hết hàng
                                </span>
                            ) : (
                                /* SỬA LỖI: Bỏ max-w-[80px] và truncate để hiện full ngày */
                                <div className="flex items-center gap-1 bg-[#FFF0EE] px-1.5 py-1 rounded-lg border border-red-100">
                                    <Clock size={10} className="text-[#FF5722] flex-shrink-0" strokeWidth={2.5} />
                                    <span className="text-[9px] font-bold text-[#FF5722] whitespace-nowrap">
                                        {product.timeLeft}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="absolute bottom-0 w-full bg-white h-[85px] rounded-t-[30px] shadow-[0_-5px_30px_rgba(0,0,0,0.06)] flex justify-between items-end px-8 pb-5 z-50">
            <div className="flex flex-col items-center gap-1.5 cursor-pointer text-primary group">
              <Home size={24} strokeWidth={2.8} className="group-hover:scale-110 transition-transform"/>
              <span className="text-[9px] font-bold mt-0.5">Trang chủ</span>
            </div>
            
            <div className="flex flex-col items-center gap-1.5 cursor-pointer text-gray-400 hover:text-primary transition-colors group">
              <MapIcon size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform"/>
              <span className="text-[9px] font-medium mt-0.5">Bản đồ</span>
            </div>

            <div className="relative -top-8 group cursor-pointer">
              <div className="w-[66px] h-[66px] bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 border-[5px] border-[#FAFAFA] transform transition-transform group-hover:scale-105 group-active:scale-95">
                <ShoppingBag size={26} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 whitespace-nowrap group-hover:text-primary transition-colors">
                Giỏ hàng
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 cursor-pointer text-gray-400 hover:text-primary transition-colors group">
              <ClipboardList size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform"/>
              <span className="text-[9px] font-medium mt-0.5">Đơn hàng</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 cursor-pointer text-gray-400 hover:text-primary transition-colors group">
              <User size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform"/>
              <span className="text-[9px] font-medium mt-0.5">Cá nhân</span>
            </div>
        </div>

      </div>
    </div>
  );
}

export default App;