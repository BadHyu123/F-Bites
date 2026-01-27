
import React, { useState, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  Search, Filter, ChevronRight, 
  Package, User, Store, MapPin, 
  Clock, CheckCircle2, XCircle, AlertCircle,
  MoreHorizontal, Eye, Trash2, ArrowRight,
  ClipboardList, Users, BarChart2, Leaf, LogOut,
  X, HelpCircle, LayoutDashboard, Award, Ticket, Tag
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Order, CartItem } from '../../types';

type OrderStatus = Order['status'] | 'ALL';

export const AdminOrderManagement: React.FC = () => {
  const { orders, users, updateOrderStatus, logout } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const menuItems = [
    { name: 'Duyệt người bán', icon: Users, path: '/admin' },
    { name: 'Quản lý Đơn Hàng', icon: ClipboardList, path: '/admin/orders', active: true },
    { name: 'Quản lý tài khoản', icon: LayoutDashboard, path: '/admin/accounts' },
    { name: 'Báo cáo', icon: BarChart2, path: '/admin/reports' },
  ];

  const handleLogout = () => {
    if(window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản Admin?')) {
        logout();
        navigate('/auth');
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'PREPARING': return 'Đang chuẩn bị';
      case 'READY': return 'Sẵn sàng giao';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'PREPARING': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'READY': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'CANCELLED': return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = activeTab === 'ALL' || order.status === activeTab;
      const buyer = users.find(u => u.id === order.buyerId);
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        buyer?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery, users]);

  const handleCancelOrder = () => {
    if (!selectedOrder || !cancelReason.trim()) return;
    updateOrderStatus(selectedOrder.id, 'CANCELLED');
    alert(`Đã hủy đơn ${selectedOrder.id}. Lý do: ${cancelReason}`);
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancelReason('');
  };

  return (
    <div className="flex w-full h-screen bg-[#F0F2F5] font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#19454B] flex flex-col h-full shrink-0 relative overflow-hidden">
        <div className="p-6 mb-4">
           <div className="flex items-center gap-1">
              <div className="relative">
                <span className="text-4xl font-black text-[#FF6B35]">F</span>
                <div className="absolute -top-1 -right-4">
                   <Leaf className="text-green-400 rotate-12" size={18} fill="currentColor" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white ml-2">Bites</span>
           </div>
        </div>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-colors ${
                item.active 
                ? 'bg-white/20 text-white border-l-4 border-white shadow-inner' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto relative z-10">
            <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-black text-white bg-rose-500 hover:bg-rose-600 transition-all rounded-2xl shadow-lg shadow-rose-900/20 active:scale-95"
            >
                <LogOut size={20} />
                <span>ĐĂNG XUẤT</span>
            </button>
        </div>
        <div className="absolute bottom-4 left-4 opacity-10 pointer-events-none">
            <Leaf size={120} className="text-white rotate-45" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white flex items-center justify-between px-8 border-b border-gray-100 shrink-0">
          <h1 className="text-2xl font-black text-[#19454B]">Quản lý Đơn hàng</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-[400px]">
              <input 
                type="text" 
                placeholder="Tìm mã đơn, tên khách hàng..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#19454B]/20 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            {/* Notification icon removed */}
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto no-scrollbar">
          {/* Tabs */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex bg-gray-200/50 p-1 rounded-2xl shadow-inner border border-gray-100">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'PENDING', label: 'Chờ duyệt' },
                { id: 'PREPARING', label: 'Chuẩn bị' },
                { id: 'READY', label: 'Sẵn sàng' },
                { id: 'COMPLETED', label: 'Hoàn thành' },
                { id: 'CANCELLED', label: 'Đã hủy' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as OrderStatus)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeTab === tab.id 
                    ? 'bg-[#19454B] text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                <Filter size={14} /> <span>{filteredOrders.length} đơn hàng được tìm thấy</span>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-[0.1em]">
                  <th className="px-8 py-5">Mã đơn</th>
                  <th className="px-4 py-5">Người mua</th>
                  <th className="px-4 py-5">Người bán</th>
                  <th className="px-4 py-5 text-center">Hình thức</th>
                  <th className="px-4 py-5">Tổng tiền</th>
                  <th className="px-4 py-5">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map(order => {
                  const buyer = users.find(u => u.id === order.buyerId);
                  const seller = users.find(u => u.id === order.sellerId);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-black text-[#19454B] text-sm">#{order.id}</span>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                              {buyer?.name.charAt(0)}
                           </div>
                           <span className="text-xs font-bold text-gray-700">{buyer?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center font-bold text-xs">
                              {seller?.shopName?.charAt(0) || 'S'}
                           </div>
                           <span className="text-xs font-bold text-gray-600">{seller?.shopName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${order.type === 'PICKUP' ? 'bg-indigo-50 text-indigo-500' : 'bg-orange-50 text-orange-500'}`}>
                           {order.type === 'PICKUP' ? 'Tại quán' : 'Giao hàng'}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="font-black text-[#FF7043]">{order.total.toLocaleString()}đ</span>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-[#19454B] hover:text-white transition-all shadow-sm"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold">Không tìm thấy đơn hàng nào phù hợp</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-[#19454B]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-black text-[#19454B]">Đơn hàng #{selectedOrder.id}</h2>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                 </div>
                 <p className="text-xs text-gray-400 font-bold">Ngày tạo: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-3 bg-white text-gray-400 rounded-2xl hover:bg-gray-100 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
               <div className="grid grid-cols-12 gap-10">
                  {/* Left Column: Items & Info */}
                  <div className="col-span-8 space-y-8">
                     <section>
                        <h3 className="text-sm font-black text-[#19454B] uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Package size={18} /> Món ăn trong đơn
                        </h3>
                        <div className="bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden">
                           {selectedOrder.items.map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-5 border-b last:border-none border-gray-100 hover:bg-white transition-colors">
                                <div className="flex items-center gap-4">
                                   <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                                      <img src={item.image} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <h4 className="text-sm font-black text-gray-800">{item.name}</h4>
                                      <p className="text-xs text-gray-400 font-bold uppercase">{item.category}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-sm font-black text-[#19454B]">{item.cartQuantity} x {item.discountedPrice.toLocaleString()}đ</p>
                                   <p className="text-xs text-gray-400 line-through">{(item.originalPrice * item.cartQuantity).toLocaleString()}đ</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </section>

                     <div className="grid grid-cols-2 gap-6">
                        <section className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                           <h3 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <User size={16} /> Người mua (Buyer)
                           </h3>
                           <div className="space-y-3">
                              <div>
                                <p className="text-sm font-black text-blue-900">{users.find(u => u.id === selectedOrder.buyerId)?.name}</p>
                                <p className="text-xs text-blue-700">{users.find(u => u.id === selectedOrder.buyerId)?.email}</p>
                              </div>
                              {selectedOrder.deliveryAddress && (
                                <div className="mt-3 flex items-start gap-2 text-xs text-blue-600 bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                                   <MapPin size={14} className="mt-0.5 shrink-0" />
                                   <span className="font-bold">Giao đến: {selectedOrder.deliveryAddress}</span>
                                </div>
                              )}
                           </div>
                        </section>

                        <section className="bg-teal-50/50 p-6 rounded-[2rem] border border-teal-100">
                           <h3 className="text-xs font-black text-teal-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Store size={16} /> Nhà bán hàng (Seller)
                           </h3>
                           <div className="space-y-3">
                              <div>
                                <p className="text-sm font-black text-teal-900">{users.find(u => u.id === selectedOrder.sellerId)?.shopName}</p>
                                <p className="text-xs text-teal-700">Mã định danh: {selectedOrder.sellerId}</p>
                              </div>
                              <div className="mt-3 flex items-start gap-2 text-xs text-teal-600 bg-white p-3 rounded-xl border border-teal-100 shadow-sm">
                                   <MapPin size={14} className="mt-0.5 shrink-0" />
                                   <span className="font-bold">Địa chỉ: {users.find(u => u.id === selectedOrder.sellerId)?.shopAddress || 'Chưa cập nhật'}</span>
                              </div>
                           </div>
                        </section>
                     </div>

                     {selectedOrder.note && (
                       <section className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                          <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <HelpCircle size={16} /> Ghi chú từ khách
                          </h3>
                          <p className="text-sm text-amber-900 italic">"{selectedOrder.note}"</p>
                       </section>
                     )}
                  </div>

                  {/* Right Column: Summary */}
                  <div className="col-span-4 space-y-8">
                     <section className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/50">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Chi tiết thanh toán</h3>
                        <div className="space-y-4 mb-6">
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-400 font-bold">Tạm tính</span>
                              <span className="text-[#19454B] font-black">{(selectedOrder.total - selectedOrder.shippingFee).toLocaleString()}đ</span>
                           </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-400 font-bold">Phí giải cứu (Ship)</span>
                              <span className="text-[#19454B] font-black">{selectedOrder.shippingFee.toLocaleString()}đ</span>
                           </div>
                           
                           {/* Giả định voucher nếu có */}
                           <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="flex items-center gap-2 text-emerald-700">
                                    <Tag size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Voucher: SAVEPLANET</span>
                                </div>
                                <span className="text-xs font-black text-emerald-600">-0đ</span>
                           </div>

                           <div className="h-px bg-gray-100 my-2"></div>
                           <div className="flex justify-between items-center">
                              <span className="text-lg font-black text-[#19454B]">Tổng cộng</span>
                              <span className="text-2xl font-black text-[#FF7043]">{selectedOrder.total.toLocaleString()}đ</span>
                           </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#19454B]">
                                <Ticket size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Phương thức</p>
                                <p className="text-xs font-bold text-[#19454B]">Ví F-Bites / QR Pay</p>
                            </div>
                        </div>

                        {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'COMPLETED' && (
                             <button 
                                onClick={() => setShowCancelModal(true)}
                                className="w-full py-4 mt-6 rounded-2xl bg-rose-50 border-2 border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={14} /> Hủy đơn cưỡng chế
                            </button>
                        )}
                     </section>

                     <section className="px-4">
                         <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Lịch sử trạng thái</h3>
                         <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {[
                               { label: 'Đơn hàng được tạo', time: selectedOrder.createdAt, icon: Clock, done: true },
                               { label: 'Nhà hàng xác nhận', time: '14:35', icon: CheckCircle2, done: selectedOrder.status !== 'PENDING' && selectedOrder.status !== 'CANCELLED' },
                               { label: 'Bắt đầu xử lý', time: '--:--', icon: Package, done: ['PREPARING', 'READY', 'COMPLETED'].includes(selectedOrder.status) },
                               { label: 'Đã hoàn tất', time: '--:--', icon: Award, done: selectedOrder.status === 'COMPLETED' },
                            ].map((step, i) => (
                               <div key={i} className="flex gap-4 relative z-10">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm border-2 ${step.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                     <step.icon size={12} />
                                  </div>
                                  <div>
                                     <p className={`text-xs font-black uppercase ${step.done ? 'text-[#19454B]' : 'text-gray-400'}`}>{step.label}</p>
                                     <p className="text-[10px] text-gray-400 font-bold">{step.done ? step.time : '...'}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                     </section>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reason Modal */}
      {showCancelModal && (
         <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
               <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                     <AlertCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-[#19454B]">Xác nhận hủy đơn</h3>
                  <p className="text-sm text-gray-400 font-medium mt-2">Việc hủy đơn từ Admin sẽ ảnh hưởng đến uy tín của các bên liên quan.</p>
               </div>

               <div className="space-y-4">
                  <textarea 
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Lý do hủy đơn (Vd: Sai phạm chính sách, Nhà bán gian lận...)"
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 min-h-[120px] text-sm"
                  />
                  <div className="flex gap-3">
                     <button 
                        onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                        className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                     >
                        Quay lại
                     </button>
                     <button 
                        disabled={!cancelReason.trim()}
                        onClick={handleCancelOrder}
                        className="flex-[2] py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all disabled:opacity-50"
                     >
                        Xác nhận Hủy đơn
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
