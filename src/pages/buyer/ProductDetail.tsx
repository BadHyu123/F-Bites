
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { Header } from '../../components/Header';
import { Minus, Plus, Clock, Store, ShoppingBag, Package, Zap, Leaf, Info, CheckCircle2 } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { products, addToCart, user } = useApp();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  const checkAuth = () => {
      if (!user) {
          navigate('/auth');
          return false;
      }
      return true;
  };

  const handleAddToCart = () => {
    if (!checkAuth()) return;
    addToCart(product, qty);
    alert("Đã thêm vào giỏ hàng! Cảm ơn bạn đã chung tay giải cứu.");
  };

  const handleBuyNow = () => {
    if (!checkAuth()) return;
    addToCart(product, qty);
    navigate('/buyer/cart');
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      <Header title="Chi tiết món" back />
      
      <div className="flex-1 pb-[180px] overflow-y-auto">
        <div className="h-64 w-full bg-gray-200 relative group">
            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
            <div className="absolute top-4 left-4">
                <span className="bg-[#FF7043] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Leaf size={12} fill="currentColor" />
                    Giảm {Math.round(((product.originalPrice - product.discountedPrice)/product.originalPrice)*100)}%
                </span>
            </div>
        </div>

        <div className="p-5 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#19454B] leading-tight mb-2">{product.name}</h1>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold text-[#FF7043]">{product.discountedPrice.toLocaleString()} đ</span>
                    <span className="text-gray-400 text-sm line-through mb-1.5">{product.originalPrice.toLocaleString()} đ</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Leaf size={14} fill="currentColor"/></div>
                    <span className="text-xs font-bold text-green-800">Bạn sẽ giảm được ~0.5kg rác thải thực phẩm</span>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 relative overflow-hidden">
                <div className="flex items-start gap-3 relative z-10">
                    <Info size={20} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="font-bold text-blue-900 text-sm mb-1">Tại sao món này cần giải cứu?</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            "Đây là phần bánh dư trong ngày của cửa hàng. Hương vị vẫn tuyệt hảo và đảm bảo an toàn vệ sinh thực phẩm cho đến sáng mai."
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                     <div className="bg-white p-2 rounded-full text-[#19454B] shadow-sm"><Store size={18} /></div>
                     <div className="overflow-hidden">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Người bán</p>
                        <p className="font-bold text-sm text-gray-800 truncate">{product.sellerName}</p>
                     </div>
                </div>
                <div className="flex-1 bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-3">
                     <div className="bg-white p-2 rounded-full text-[#FF7043] shadow-sm"><Clock size={18} /></div>
                     <div>
                        <p className="text-[10px] text-red-400 uppercase font-bold">Hết hạn lúc</p>
                        <p className="font-bold text-sm text-[#FF7043]">
                            {new Date(product.expiryTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                        </p>
                     </div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="font-bold text-[#19454B] text-sm uppercase tracking-wide">Thông tin chi tiết</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Package size={16} className="text-[#19454B]" />
                        <span>Còn lại: <b className="text-gray-900">{product.quantity} suất</b></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#19454B]" />
                        <span>Chất lượng: <b className="text-gray-900">5 Sao</b></span>
                    </div>
                </div>
            </div>

            <div className="py-4 border-t border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-[#19454B]">Số lượng cứu</span>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setQty(Math.max(1, qty - 1))} 
                            className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-90 transition-all disabled:opacity-50"
                            disabled={qty <= 1}
                        >
                            <Minus size={18} />
                        </button>
                        
                        <div className="w-12 text-center font-bold text-xl border-b-2 border-gray-200 pb-1 text-[#19454B]">
                            {qty}
                        </div>

                        <button 
                            onClick={() => setQty(Math.min(product.quantity, qty + 1))} 
                            className="w-9 h-9 rounded-lg bg-[#19454B] flex items-center justify-center text-white hover:bg-[#13353a] active:scale-90 transition-all disabled:opacity-50"
                            disabled={qty >= product.quantity}
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-[#19454B] mb-2 text-sm uppercase tracking-wide">Mô tả món ăn</h3>
                <p className="text-gray-600 leading-relaxed text-sm text-justify">{product.description}</p>
            </div>
        </div>
      </div>

      <div className="fixed bottom-[80px] left-0 right-0 mx-auto max-w-md bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_15px_rgba(0,0,0,0.08)] z-30 safe-area-bottom">
        <div className="flex gap-3">
            <button 
                onClick={handleAddToCart}
                className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 bg-white text-[#19454B] font-bold border-2 border-[#19454B] active:scale-[0.98] transition-transform"
            >
                <ShoppingBag size={20} />
                Thêm vào giỏ
            </button>

            <button 
                onClick={handleBuyNow}
                className="flex-[1.2] h-12 rounded-xl flex items-center justify-center gap-2 bg-[#19454B] text-white font-bold shadow-lg shadow-teal-900/20 active:scale-[0.98] transition-transform hover:bg-[#13353a]"
            >
                <Zap size={20} fill="currentColor" />
                Mua ngay
            </button>
        </div>
      </div>
    </div>
  );
};
