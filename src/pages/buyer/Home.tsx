
import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { ProductCard } from '../../components/ProductCard';
import { Search, MapPin, Bell, Leaf, Globe, Recycle, ChevronDown, X, Navigation, Flame, Filter, ArrowUp, ArrowDown, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VIETNAM_LOCATIONS } from '../../utils/mockData';
import { Button } from '../../components/UI';

export const BuyerHome: React.FC = () => {
  const { products, user, userLocation, updateUserLocation, wishlist } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tất cả');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'EXPIRY'>('NEWEST');

  const [tempProvince, setTempProvince] = useState(userLocation.province);
  const [tempDistrict, setTempDistrict] = useState(userLocation.district);
  const [tempWard, setTempWard] = useState(userLocation.ward);

  const categories = ['Tất cả', 'Bánh ngọt', 'Cơm/Bún', 'Sushi', 'Đồ tươi', 'Đồ uống'];

  let filteredProducts = products.filter(p => 
    (filter === 'Tất cả' || p.category === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    !p.isDeleted && p.quantity > 0
  );

  if (sortOption === 'PRICE_ASC') {
      filteredProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
  } else if (sortOption === 'PRICE_DESC') {
      filteredProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
  } else if (sortOption === 'EXPIRY') {
      filteredProducts.sort((a, b) => new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime());
  }

  const currentDistricts = VIETNAM_LOCATIONS.find(p => p.name === tempProvince)?.districts || [];
  const currentWards = currentDistricts.find(d => d.name === tempDistrict)?.wards || [];

  useEffect(() => {
    if (isLocationModalOpen) {
        setTempProvince(userLocation.province);
        setTempDistrict(userLocation.district);
        setTempWard(userLocation.ward);
    }
  }, [isLocationModalOpen, userLocation]);

  const handleSaveLocation = () => {
      updateUserLocation({
          province: tempProvince,
          district: tempDistrict,
          ward: tempWard,
          addressDisplay: `${tempWard}, ${tempDistrict}, ${tempProvince}`
      });
      setIsLocationModalOpen(false);
  };

  const handleUseGPS = () => {
      updateUserLocation({
          province: "Hồ Chí Minh",
          district: "Quận 1",
          ward: "Bến Nghé",
          addressDisplay: "Vị trí hiện tại (GPS)",
          lat: 10.7769, 
          lng: 106.7009
      });
      setIsLocationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <div className="bg-[#19454B] px-6 pt-12 pb-10 rounded-b-[2.5rem] shadow-xl relative overflow-visible z-10">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-b-[2.5rem] opacity-10 pointer-events-none">
            <Leaf className="absolute top-[-10px] right-[-20px] text-white w-32 h-32 rotate-12" />
            <Globe className="absolute bottom-[-10px] left-[-20px] text-white w-24 h-24 -rotate-12" />
        </div>

        <div className="flex justify-between items-center mb-6 text-white relative z-10">
            <div>
                <p className="text-teal-200 text-[10px] uppercase tracking-wider font-bold mb-1 opacity-80">
                    Vị trí hiện tại
                </p>
                <button 
                    onClick={() => setIsLocationModalOpen(true)}
                    className="flex items-center gap-1 font-bold text-white bg-white/10 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/20 transition-all active:scale-95 border border-white/10 backdrop-blur-md max-w-[200px]"
                >
                    <MapPin size={14} className="text-[#FF7043] shrink-0" fill="currentColor" />
                    <span className="truncate text-sm">{userLocation.addressDisplay}</span>
                    <ChevronDown size={14} className="opacity-70 shrink-0" />
                </button>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={() => user ? navigate('/buyer/wishlist') : navigate('/auth')} 
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center relative transition-colors border border-white/10"
                >
                    <Bell size={20} />
                    {user && wishlist.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#19454B]"></span>}
                </button>

                {user ? (
                    <div onClick={() => navigate('/buyer/profile')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#19454B] border-2 border-white/20 cursor-pointer overflow-hidden">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar"/> : user.name.charAt(0)}
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/auth')}
                        className="h-10 px-3 bg-[#FF7043] rounded-full flex items-center gap-1 font-bold text-xs hover:bg-[#e64a19] shadow-md"
                    >
                        <LogIn size={14} /> Đăng nhập
                    </button>
                )}
            </div>
        </div>

        <div className="relative z-10 mb-6 animate-fade-in">
             <h1 className="text-2xl font-bold text-white leading-tight">
              Giải cứu món ngon <br/> 
              <span className="text-[#FF7043]">Giá rẻ bất ngờ!</span>
            </h1>
        </div>
        
        <div className="relative z-20 -mb-14">
          <div className="relative shadow-xl shadow-teal-900/20 rounded-2xl bg-white">
              <input 
                type="text" 
                placeholder="Tìm bánh mì, cơm tấm..." 
                className="w-full pl-12 pr-12 py-4 rounded-2xl focus:outline-none text-gray-800 placeholder-gray-400 font-medium bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              
              <button 
                onClick={() => setIsFilterModalOpen(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-50 rounded-xl text-[#19454B] hover:bg-gray-100"
              >
                  <Filter size={18} />
              </button>
          </div>
        </div>
      </div>

      <div className="px-5 mt-20">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Recycle className="text-green-600 w-6 h-6" />
            </div>
            <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Cộng đồng F-bites hôm nay</p>
                <p className="text-gray-800 font-bold text-sm">
                    🌱 Đã giải cứu <span className="text-[#FF7043] text-lg">1,250kg</span> thực phẩm
                </p>
            </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-6 -mx-5 px-5 snap-x">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`snap-start px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-bold transition-all flex items-center gap-2 border ${
                filter === cat 
                ? 'bg-[#19454B] text-white border-[#19454B] shadow-lg shadow-teal-900/20' 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat === filter && <Leaf size={12} fill="currentColor" />}
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-end mb-4">
            <div>
                <h2 className="text-lg font-black text-[#19454B] flex items-center gap-2">
                    <Flame className="text-[#FF7043] fill-[#FF7043] animate-pulse" size={20} /> 
                    Sắp hết hạn
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Nhanh tay trước khi quá muộn</p>
            </div>
            <button className="text-xs text-[#19454B] font-bold hover:underline">Xem tất cả</button>
        </div>

        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 pb-10">
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        ) : (
            <div className="text-center py-12 opacity-50">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf size={40} className="text-gray-400"/>
                </div>
                <p className="text-sm font-bold text-gray-600">Không tìm thấy món nào.</p>
                <p className="text-xs text-gray-400 mt-1">Hãy thử tìm từ khóa khác hoặc quay lại sau.</p>
            </div>
        )}

      </div>

      {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
               <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-[#19454B]">Bộ lọc & Sắp xếp</h3>
                      <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sắp xếp theo</label>
                       <div className="grid grid-cols-2 gap-3">
                           <button 
                             onClick={() => setSortOption('NEWEST')}
                             className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 ${sortOption === 'NEWEST' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-200 text-gray-500'}`}
                           >
                              Mới nhất
                           </button>
                           <button 
                             onClick={() => setSortOption('EXPIRY')}
                             className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 ${sortOption === 'EXPIRY' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-200 text-gray-500'}`}
                           >
                              <Flame size={16} /> Hết hạn sớm
                           </button>
                           <button 
                             onClick={() => setSortOption('PRICE_ASC')}
                             className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 ${sortOption === 'PRICE_ASC' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-200 text-gray-500'}`}
                           >
                              Giá thấp <ArrowUp size={14}/>
                           </button>
                           <button 
                             onClick={() => setSortOption('PRICE_DESC')}
                             className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 ${sortOption === 'PRICE_DESC' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-200 text-gray-500'}`}
                           >
                              Giá cao <ArrowDown size={14}/>
                           </button>
                       </div>
                  </div>

                  <Button fullWidth onClick={() => setIsFilterModalOpen(false)} className="shadow-xl py-4 text-base">
                      Áp dụng
                  </Button>
               </div>
          </div>
      )}

      {isLocationModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-[#19454B]">Chọn khu vực</h3>
                      <button onClick={() => setIsLocationModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X size={20}/></button>
                  </div>

                  <button 
                    onClick={handleUseGPS}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-bold py-3.5 rounded-xl mb-6 border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                      <Navigation size={18} fill="currentColor" /> Sử dụng vị trí hiện tại
                  </button>

                  <div className="space-y-4 mb-8">
                      <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tỉnh / Thành phố</label>
                            <div className="relative">
                                <select 
                                    value={tempProvince} 
                                    onChange={(e) => {
                                        setTempProvince(e.target.value);
                                        const newDistricts = VIETNAM_LOCATIONS.find(p => p.name === e.target.value)?.districts || [];
                                        setTempDistrict(newDistricts[0]?.name || '');
                                        setTempWard(newDistricts[0]?.wards[0] || '');
                                    }}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#19454B] bg-gray-50 text-sm font-medium appearance-none"
                                >
                                    {VIETNAM_LOCATIONS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quận / Huyện</label>
                            <div className="relative">
                                <select 
                                    value={tempDistrict} 
                                    onChange={(e) => {
                                        setTempDistrict(e.target.value);
                                        const newWards = currentDistricts.find(d => d.name === e.target.value)?.wards || [];
                                        setTempWard(newWards[0] || '');
                                    }}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#19454B] bg-gray-50 text-sm font-medium appearance-none"
                                >
                                    {currentDistricts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phường / Xã</label>
                            <div className="relative">
                                <select 
                                    value={tempWard} 
                                    onChange={(e) => setTempWard(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#19454B] bg-gray-50 text-sm font-medium appearance-none"
                                >
                                    {currentWards.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                  </div>

                  <Button fullWidth onClick={handleSaveLocation} className="shadow-xl shadow-teal-900/20 py-4 text-base">
                      Xác nhận địa chỉ
                  </Button>
              </div>
          </div>
      )}

    </div>
  );
};
