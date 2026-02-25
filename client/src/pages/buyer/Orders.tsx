
import React from 'react';
import { useApp } from '../../hooks/useApp';
import { Header, StatusBadge } from '../../components/Common';
import { QrCode, MapPin, Store } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const BuyerOrders: React.FC = () => {
  const { orders, user } = useApp();
  
  const myOrders = orders.filter(o => o.buyerId === user?.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Lịch sử đơn hàng" />
      
      <div className="p-4 space-y-4">
        {myOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Store size={32} />
                </div>
                <p>Bạn chưa có đơn hàng nào.</p>
            </div>
        )}

        {myOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-50">
                    <Store size={16} className="text-[#19454B]" />
                    <span className="font-bold text-sm text-[#19454B] flex-1 truncate">
                         Shop ID: {order.sellerId} (Xem chi tiết)
                    </span>
                    <span className="text-xs text-gray-400">#{order.id.slice(-6)}</span>
                </div>

                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                         <img src={order.items[0].image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" alt="Food" />
                         <div>
                            <div className="font-bold text-[#19454B] text-sm line-clamp-1">{order.items[0].name}</div>
                            {order.items.length > 1 && (
                                <div className="text-xs text-gray-500 mt-1">+ {order.items.length - 1} món khác</div>
                            )}
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                         </div>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                <div className="flex justify-between items-end mt-2">
                     <div className="text-xs text-gray-500">
                        {order.type === 'PICKUP' ? 'Tự đến lấy' : 'Giao hàng tận nơi'}
                     </div>
                     <div className="text-right">
                        <span className="text-xs text-gray-400 block">Thành tiền</span>
                        <span className="font-bold text-[#FF7043]">{order.total.toLocaleString()} đ</span>
                     </div>
                </div>

                {order.type === 'PICKUP' && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                    <div className="mt-4 bg-teal-50 p-3 rounded-lg flex items-center gap-4 border border-teal-100 border-dashed">
                        <div className="bg-white p-1 rounded">
                             <QrCode size={48} className="text-[#19454B]" />
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-bold text-[#19454B] uppercase block">Mã lấy hàng</span>
                            <span className="font-mono font-bold text-lg tracking-wider block">{order.pickupCode}</span>
                            <p className="text-[10px] text-gray-500 mt-0.5">Đưa mã này cho nhân viên quán</p>
                        </div>
                    </div>
                )}
                {order.status === 'COMPLETED' && (
                    <div className="mt-4 bg-white p-3 rounded-lg border border-gray-100">
                        <h4 className="font-bold text-sm text-gray-700 mb-2">Đánh giá đơn hàng</h4>
                        <div className="flex items-center gap-2 mb-2">
                            <select value={rating} onChange={e => setRating(Number(e.target.value))} className="px-3 py-2 border rounded">
                                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} sao</option>)}
                            </select>
                            <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Viết nhận xét (tùy chọn)" className="flex-1 px-3 py-2 border rounded" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={async () => {
                                // submit review for first item
                                const productId = order.items[0]?.productId || order.items[0]?.id;
                                try {
                                    const token = localStorage.getItem('fbites_token');
                                    const res = await fetch('http://localhost:5000/api/reviews', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                                        body: JSON.stringify({ productId, orderId: order.id, rating, comment })
                                    });
                                    if (!res.ok) throw new Error('Failed');
                                    alert('Cảm ơn đánh giá của bạn!');
                                    setComment('');
                                } catch (e) {
                                    alert('Gửi đánh giá thất bại');
                                }
                            }} className="px-4 py-2 bg-[#19454B] text-white rounded">Gửi đánh giá</button>
                            <button onClick={() => navigate(`/buyer/order/${order.id}`)} className="px-4 py-2 border rounded">Xem chi tiết</button>
                        </div>
                    </div>
                )}
                
                {order.type === 'DELIVERY' && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">Giao đến: {order.deliveryAddress}</span>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};
