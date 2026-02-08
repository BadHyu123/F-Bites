
import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Button, Header, Input } from '../../components/Common';
import { Trash2, Store, Truck, Leaf, ArrowRight, Minus, Plus, MapPin, QrCode, ShieldCheck, X, Ticket, Wallet, CreditCard, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types';
import { VIETNAM_LOCATIONS } from '../../utils/mockData';

export const CartScreen: React.FC = () => {
  const { cart, removeFromCart, addToCart, userLocation, vouchers } = useApp();
  const [tab, setTab] = useState<'DELIVERY' | 'PICKUP'>('PICKUP');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER'>('TRANSFER');
  const [selectedQRItem, setSelectedQRItem] = useState<CartItem | null>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{code: string, discount: number} | null>(null);
  const navigate = useNavigate();

  const [province, setProvince] = useState(userLocation.province);
  const [district, setDistrict] = useState(userLocation.district);
  const [ward, setWard] = useState(userLocation.ward);
  const [street, setStreet] = useState('');

  useEffect(() => {
      setProvince(userLocation.province);
      setDistrict(userLocation.district);
      setWard(userLocation.ward);
  }, [userLocation]);

  const currentDistricts = VIETNAM_LOCATIONS.find(p => p.name === province)?.districts || [];
  const currentWards = currentDistricts.find(d => d.name === district)?.wards || [];

  useEffect(() => {
     if (!currentDistricts.find(d => d.name === district)) {
         setDistrict(currentDistricts[0]?.name || '');
     }
  }, [province, currentDistricts]);

  useEffect(() => {
      if (!currentWards.includes(ward)) {
          setWard(currentWards[0] || '');
      }
  }, [district, currentWards]);

  const fullAddress = `${street}, ${ward}, ${district}, ${province}`;

  const groupedCart: Record<string, CartItem[]> = {};
  cart.forEach(item => {
    if (!groupedCart[item.sellerName]) groupedCart[item.sellerName] = [];
    groupedCart[item.sellerName].push(item);
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.discountedPrice * item.cartQuantity), 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.originalPrice * item.cartQuantity), 0);
  
  const handleApplyVoucher = () => {
      const v = vouchers.find(v => v.code === voucherCode.toUpperCase() && v.isActive);
      if (v) {
          let discount = 0;
          if (v.type === 'PERCENT') discount = (subtotal * v.value) / 100;
          else discount = v.value;
          
          setAppliedVoucher({ code: v.code, discount });
          alert(`Đã áp dụng mã ${v.code}! Giảm ${discount.toLocaleString()}đ`);
      } else {
          alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      }
  };

  const totalSaved = (totalOriginal - subtotal) + (appliedVoucher?.discount || 0);
  const numberOfShops = Object.keys(groupedCart).length;
  const shipping = tab === 'DELIVERY' ? (15000 * numberOfShops) : 0;
  const total = subtotal + shipping - (appliedVoucher?.discount || 0);

  const handleProceedToCheckout = () => {
    if (tab === 'DELIVERY' && !street.trim()) {
        alert("Vui lòng nhập số nhà và tên đường");
        return;
    }
    
    navigate('/buyer/checkout', { 
        state: { 
            total, 
            type: tab, 
            paymentMethod: tab === 'PICKUP' ? paymentMethod : 'TRANSFER',
            address: tab === 'DELIVERY' ? fullAddress : undefined,
            itemsCount: cart.length,
            totalSaved,
            appliedVoucher: appliedVoucher?.code
        } 
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Giỏ hàng" />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Leaf size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-600">Giỏ hàng trống</h3>
            <p className="mt-2 text-sm">Hãy giải cứu một vài món ngon để bảo vệ môi trường nhé!</p>
            <Button onClick={() => navigate('/buyer/home')} className="mt-6">Về trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header title="Giỏ hàng" back />
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[180px] p-4 space-y-4">
        <div className="bg-white p-1 rounded-xl flex shadow-sm border border-gray-100">
            <button onClick={() => setTab('PICKUP')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'PICKUP' ? 'bg-[#19454B] text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Store size={16} /> Tự đến lấy
            </button>
            <button onClick={() => setTab('DELIVERY')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'DELIVERY' ? 'bg-[#19454B] text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Truck size={16} /> Giao hàng
            </button>
        </div>

        {tab === 'PICKUP' && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 animate-in fade-in duration-300">
                <h3 className="font-bold text-sm text-[#19454B] flex items-center gap-2">
                    <Wallet size={16} className="text-[#FF7043]" /> Hình thức thanh toán
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setPaymentMethod('TRANSFER')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${paymentMethod === 'TRANSFER' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-100 text-gray-400'}`}
                    >
                        <CreditCard size={20} />
                        <span className="text-[10px] font-bold">Chuyển khoản</span>
                    </button>
                    <button 
                        onClick={() => setPaymentMethod('CASH')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${paymentMethod === 'CASH' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-100 text-gray-400'}`}
                    >
                        <Wallet size={20} />
                        <span className="text-[10px] font-bold">Tiền mặt</span>
                    </button>
                </div>
            </div>
        )}

        {tab === 'DELIVERY' && (
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 animate-in slide-in-from-top duration-300">
                 <h3 className="font-bold text-sm text-[#19454B] flex items-center gap-2">
                    <MapPin size={16} className="text-[#FF7043]" /> Địa chỉ giao hàng
                 </h3>
                 <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500">Tỉnh / Thành phố</label>
                        <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            {VIETNAM_LOCATIONS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">Quận / Huyện</label>
                            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                                {currentDistricts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">Phường / Xã</label>
                            <select value={ward} onChange={(e) => setWard(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                                {currentWards.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>
                    <Input placeholder="Số nhà, Tên đường..." value={street} onChange={(e) => setStreet(e.target.value)} />
                 </div>
             </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm text-[#19454B] flex items-center gap-2 mb-3">
                <Ticket size={16} className="text-[#FF7043]" /> Mã giảm giá F-bites
            </h3>
            <div className="flex gap-2">
                <Input 
                    placeholder="Nhập mã giảm giá..." 
                    className="h-11"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                />
                <Button onClick={handleApplyVoucher} variant="outline" className="h-11 px-4 border-dashed">Áp dụng</Button>
            </div>
            {appliedVoucher && (
                <div className="mt-2 text-[10px] font-bold text-green-600 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 size={12} /> Đã áp dụng mã {appliedVoucher.code} (-{appliedVoucher.discount.toLocaleString()}đ)
                </div>
            )}
        </div>

        {Object.entries(groupedCart).map(([sellerName, items]) => (
            <div key={sellerName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                    <Store size={14} className="text-[#19454B]" />
                    <span className="font-bold text-sm text-[#19454B]">{sellerName}</span>
                </div>
                <div className="p-3 space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="flex gap-3 items-center">
                            <div className="relative group shrink-0">
                                <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" alt={item.name} />
                                <button onClick={() => setSelectedQRItem(item)} className="absolute -top-1 -right-1 bg-[#19454B] text-white p-1 rounded-full shadow-lg border border-white">
                                    <QrCode size={10} />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-sm text-[#19454B] mb-1 line-clamp-1">{item.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#FF7043] text-sm">{item.discountedPrice.toLocaleString()} đ</span>
                                    <span className="text-[10px] text-gray-400 line-through">{item.originalPrice.toLocaleString()} đ</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                <button onClick={() => item.cartQuantity > 1 ? addToCart(item, -1) : removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-500">
                                    {item.cartQuantity === 1 ? <Trash2 size={12} /> : <Minus size={12}/>}
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{item.cartQuantity}</span>
                                <button onClick={() => addToCart(item, 1)} className="w-6 h-6 flex items-center justify-center text-[#19454B]">
                                    <Plus size={12}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
        
        <div className="bg-gradient-to-r from-[#19454B] to-teal-800 p-5 rounded-2xl shadow-lg text-white mb-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <div className="flex justify-between text-sm mb-2 opacity-80">
                <span>Tổng giá món</span>
                <span className="font-bold">{subtotal.toLocaleString()} đ</span>
             </div>
             {appliedVoucher && (
                 <div className="flex justify-between text-sm mb-2 text-green-300 font-bold">
                    <span>Mã giảm giá</span>
                    <span>-{appliedVoucher.discount.toLocaleString()} đ</span>
                 </div>
             )}
             <div className="flex justify-between items-center mb-1">
                 <span className="font-bold">Tổng tiết kiệm</span>
                 <span className="font-bold text-2xl text-[#FF7043]">{totalSaved.toLocaleString()} đ</span>
             </div>
             <div className="h-px bg-white/20 my-4"></div>
             {tab === 'DELIVERY' && (
                 <div className="flex justify-between text-sm mb-4">
                    <span className="opacity-80">Phí giao hàng</span>
                    <span className="font-bold">{shipping.toLocaleString()} đ</span>
                 </div>
             )}
             <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-400" />
                    <span className="text-xs font-bold">Bảo vệ môi trường</span>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] opacity-70 uppercase font-bold">Thanh toán</p>
                    <p className="text-xl font-black">{total.toLocaleString()} đ</p>
                 </div>
             </div>
        </div>
      </div>

      {selectedQRItem && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
                  <button onClick={() => setSelectedQRItem(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500">
                      <X size={20} />
                  </button>
                  <div className="text-center mt-4">
                      <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200 mb-6">
                          <QrCode size={180} className="mx-auto text-[#19454B] opacity-90" />
                      </div>
                      <div className="text-left">
                          <h4 className="font-bold text-[#19454B] leading-tight">{selectedQRItem.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{selectedQRItem.sellerName}</p>
                      </div>
                      <Button fullWidth onClick={() => setSelectedQRItem(null)} className="mt-6 rounded-2xl h-12">Đóng</Button>
                  </div>
              </div>
          </div>
      )}

      <div className="fixed bottom-[80px] left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40 pb-safe-area rounded-t-3xl">
          <div className="flex gap-4 items-center">
              <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng cộng</p>
                  <p className="text-2xl font-black text-[#19454B]">{total.toLocaleString()} đ</p>
              </div>
              <Button onClick={handleProceedToCheckout} className="flex-[1.8] h-14 shadow-xl shadow-orange-500/20 text-lg rounded-2xl" variant="secondary">
                Đặt hàng ngay <ArrowRight size={20} className="ml-2" />
              </Button>
          </div>
      </div>
    </div>
  );
};
