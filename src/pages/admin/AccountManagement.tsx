
import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  Search, Eye, Lock, 
  Users, Filter, Store, 
  Leaf, ClipboardList, LayoutDashboard, BarChart2,
  MoreHorizontal, AlertTriangle, Unlock, X, 
  CheckCircle2, XCircle, CreditCard, History,
  Star, Package, MessageSquare, TrendingUp, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

export const AccountManagement: React.FC = () => {
  const { users, approveShop, rejectShop, logout } = useApp();
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [activeStatusTab, setActiveStatusTab] = useState<'ALL' | 'ACTIVE' | 'LOCKED'>('ALL');
  const [search, setSearch] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const menuItems = [
    { name: 'Duyệt người bán', icon: Users, path: '/admin' },
    { name: 'Quản lý Đơn Hàng', icon: ClipboardList, path: '/admin/orders' },
    { name: 'Quản lý tài khoản', icon: LayoutDashboard, path: '/admin/accounts', active: true },
    { name: 'Báo cáo', icon: BarChart2, path: '/admin/reports' },
  ];

  const handleLogout = () => {
    if(window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản Admin?')) {
        logout();
        navigate('/auth');
    }
  };

  const filteredUsers = users.filter(u => {
    const roleMatch = activeRoleTab === 'BUYER' ? u.role === 'BUYER' : u.role === 'SELLER';
    const statusMatch = activeStatusTab === 'ALL' ? true :
                       activeStatusTab === 'ACTIVE' ? u.status !== 'REJECTED' : u.status === 'REJECTED';
    const searchMatch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
                        (u.email || '').toLowerCase().includes(search.toLowerCase());
    return roleMatch && statusMatch && searchMatch;
  });

  return (
    <div className="flex w-full h-screen bg-[#E5E5E5] font-sans relative overflow-hidden">
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
                ? 'bg-white/20 text-white border-l-4 border-white' 
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white flex items-center justify-between px-8 border-b border-gray-100 shrink-0">
          <h1 className="text-2xl font-black text-[#19454B]">Quản lý Tài khoản</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-[450px]">
              <input 
                type="text" 
                placeholder="Tìm kiếm tên, email, số điện thoại..." 
                className="w-full pl-4 pr-10 py-2.5 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            {/* Notification icon removed */}
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-gray-100 transition-transform hover:scale-[1.02]">
                <div className={`w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center`}>
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tổng người mua</p>
                  <p className="text-2xl font-black text-[#19454B]">2,482</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-gray-100 transition-transform hover:scale-[1.02]">
                <div className={`w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center`}>
                  <Store size={28} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tổng người bán</p>
                  <p className="text-2xl font-black text-[#19454B]">276</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-gray-100 transition-transform hover:scale-[1.02]">
                <div className={`w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center`}>
                  <Lock size={28} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tài khoản bị khóa</p>
                  <p className="text-2xl font-black text-[#19454B]">32</p>
                </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex bg-[#D9D9D9] p-1 rounded-xl shadow-inner">
              <button 
                onClick={() => setActiveRoleTab('BUYER')}
                className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${activeRoleTab === 'BUYER' ? 'bg-[#19454B] text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Người mua
              </button>
              <button 
                onClick={() => setActiveRoleTab('SELLER')}
                className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${activeRoleTab === 'SELLER' ? 'bg-[#19454B] text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Người bán
              </button>
            </div>
            
            <div className="flex gap-3">
              <button className="p-2.5 bg-white rounded-xl text-gray-400 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-8 py-5 flex gap-8 border-b border-gray-100">
              <button 
                onClick={() => setActiveStatusTab('ALL')}
                className={`text-sm font-bold py-2 transition-all relative ${activeStatusTab === 'ALL' ? 'text-[#19454B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#19454B]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setActiveStatusTab('ACTIVE')}
                className={`text-sm font-bold py-2 transition-all relative ${activeStatusTab === 'ACTIVE' ? 'text-[#19454B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#19454B]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Hoạt động
              </button>
              <button 
                onClick={() => setActiveStatusTab('LOCKED')}
                className={`text-sm font-bold py-2 transition-all relative ${activeStatusTab === 'LOCKED' ? 'text-[#19454B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#19454B]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Bị khóa
              </button>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                  <tr>
                    <th className="px-8 py-5">Người dùng</th>
                    <th className="px-4 py-5">Liên hệ</th>
                    <th className="px-4 py-5">Ngày đăng ký</th>
                    <th className="px-4 py-5">Trạng thái</th>
                    <th className="px-8 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                            {u.avatar ? (
                              <img src={u.avatar} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center font-black text-gray-300">
                                {u.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-bold text-[#19454B]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-xs font-bold text-gray-500">
                        {u.email || u.phone}
                      </td>
                      <td className="px-4 py-5 text-xs font-bold text-gray-400">
                        {u.createdAt}
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.status === 'REJECTED' 
                          ? 'bg-rose-50 text-rose-500 border border-rose-100' 
                          : 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                        }`}>
                          {u.status === 'REJECTED' ? 'Bị khóa' : 'Hoạt động'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-3 relative">
                          <button 
                            onClick={() => setSelectedUser(u)}
                            className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-[#19454B]/10 hover:text-[#19454B] transition-colors shadow-sm"
                          >
                            <Eye size={18} />
                          </button>
                          
                          <button 
                            onClick={() => setShowActionMenu(showActionMenu === u.id ? null : u.id)}
                            className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {showActionMenu === u.id && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] animate-in fade-in zoom-in duration-200 py-3">
                              <button 
                                onClick={() => { setSelectedUser(u); setShowActionMenu(null); }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                <Eye size={16} /> Xem tài khoản
                              </button>
                              
                              <button 
                                onClick={() => { alert(`Đã gửi cảnh báo tới ${u.name}`); setShowActionMenu(null); }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-amber-500 hover:bg-amber-50 transition-colors"
                              >
                                <AlertTriangle size={16} /> Cảnh báo tài khoản
                              </button>

                              <div className="h-px bg-gray-100 my-1 mx-4"></div>

                              {u.status === 'REJECTED' ? (
                                <button 
                                  onClick={() => { approveShop(u.id); alert(`Đã mở khóa tài khoản ${u.name}`); setShowActionMenu(null); }}
                                  className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                                >
                                  <Unlock size={16} /> Mở khóa tài khoản
                                </button>
                              ) : (
                                <>
                                  <p className="px-5 py-2 text-[10px] uppercase font-black text-gray-400 tracking-widest">Khóa tài khoản</p>
                                  <button 
                                    onClick={() => { rejectShop(u.id); alert(`Đã khóa tạm thời tài khoản ${u.name} trong 30 ngày`); setShowActionMenu(null); }}
                                    className="w-full flex items-center gap-3 px-8 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-rose-400"></div> Khóa tạm thời (30 ngày)
                                  </button>
                                  <button 
                                    onClick={() => { rejectShop(u.id); alert(`Đã khóa vĩnh viễn tài khoản ${u.name}`); setShowActionMenu(null); }}
                                    className="w-full flex items-center gap-3 px-8 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
                                  >
                                    <XCircle size={14} /> Khóa vĩnh viễn
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-6 flex justify-between items-center border-t border-gray-100 bg-white">
              <p className="text-[11px] text-gray-400 font-bold">
                Hiển thị {filteredUsers.length > 0 ? 1 : 0}-{filteredUsers.length} trên tổng số {filteredUsers.length}
              </p>
              
              <div className="flex items-center gap-2">
                <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                  Sau
                </button>
                <button className="w-10 h-10 bg-[#19454B] text-white rounded-xl text-xs font-bold shadow-lg">
                  1
                </button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                  Tiếp
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[100] bg-[#19454B]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative">
                <button 
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-6 right-8 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-[320px] bg-[#F8F9FA] p-8 border-r border-gray-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl mb-4">
                                {selectedUser.avatar ? (
                                    <img src={selectedUser.avatar} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full bg-[#19454B] flex items-center justify-center text-white text-3xl font-black">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-black text-[#19454B] mb-1">{selectedUser.name}</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                                {selectedUser.role === 'BUYER' ? 'Người giải cứu' : 'Nhà bán hàng'}
                            </p>

                            <div className="w-full space-y-3">
                                <div className="flex items-center gap-3 text-xs text-gray-500 bg-white p-3 rounded-xl border border-gray-50">
                                    <CreditCard size={14} className="text-[#19454B]" />
                                    <span className="font-bold truncate">{selectedUser.email || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 bg-white p-3 rounded-xl border border-gray-50">
                                    <History size={14} className="text-[#19454B]" />
                                    <span className="font-bold">Đăng ký: {selectedUser.createdAt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Trạng thái hiện tại</h4>
                             <div className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm ${selectedUser.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {selectedUser.status === 'REJECTED' ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                                {selectedUser.status === 'REJECTED' ? 'Tài khoản bị khóa' : 'Đang hoạt động'}
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8">
                        {selectedUser.role === 'BUYER' ? (
                          <>
                            <h3 className="text-lg font-black text-[#19454B] mb-6 flex items-center gap-2">
                                 Chỉ số tín nhiệm & Hoạt động
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex flex-col">
                                    <CheckCircle2 size={24} className="text-emerald-600 mb-3" />
                                    <span className="text-[10px] font-black text-emerald-800/50 uppercase tracking-widest">Thanh toán</span>
                                    <span className="text-2xl font-black text-emerald-700">24 đơn</span>
                                </div>
                                <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 flex flex-col">
                                    <XCircle size={24} className="text-rose-600 mb-3" />
                                    <span className="text-[10px] font-black text-rose-800/50 uppercase tracking-widest">Hủy đơn</span>
                                    <span className="text-2xl font-black text-rose-700">1 đơn</span>
                                </div>
                            </div>

                            <h3 className="text-sm font-black text-[#19454B] mb-4 flex items-center gap-2">
                                Lịch sử đặt đơn gần nhất
                            </h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-default group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#19454B] shadow-sm group-hover:bg-[#19454B] group-hover:text-white transition-colors">
                                                <ClipboardList size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">Đơn hàng #DH-220{i}</p>
                                                <p className="text-[10px] text-gray-400">Ngày 1{i}/04/2024 • 120,000đ</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Hoàn thành</span>
                                    </div>
                                ))}
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="text-lg font-black text-[#19454B] mb-6 flex items-center gap-2">
                                 Hiệu suất kinh doanh
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                      <Star size={24} className="text-amber-500 fill-amber-500" />
                                      <span className="text-xs font-black text-amber-700">Top Rated</span>
                                    </div>
                                    <span className="text-[10px] font-black text-amber-800/50 uppercase tracking-widest">Đánh giá Shop</span>
                                    <span className="text-2xl font-black text-amber-700">4.8 / 5.0</span>
                                </div>
                                <div className="bg-[#19454B]/5 p-5 rounded-3xl border border-[#19454B]/10 flex flex-col">
                                    <Package size={24} className="text-[#19454B] mb-3" />
                                    <span className="text-[10px] font-black text-[#19454B]/50 uppercase tracking-widest">Tổng món ăn</span>
                                    <span className="text-2xl font-black text-[#19454B]">126 món</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex flex-col">
                                    <TrendingUp size={24} className="text-blue-600 mb-3" />
                                    <span className="text-[10px] font-black text-blue-800/50 uppercase tracking-widest">Tỷ lệ thành công</span>
                                    <span className="text-2xl font-black text-blue-700">98%</span>
                                </div>
                                <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex flex-col">
                                    <MessageSquare size={24} className="text-emerald-600 mb-3" />
                                    <span className="text-[10px] font-black text-emerald-800/50 uppercase tracking-widest">Tổng đánh giá</span>
                                    <span className="text-2xl font-black text-emerald-700">1,4k lượt</span>
                                </div>
                            </div>

                            <h3 className="text-sm font-black text-[#19454B] mb-4 flex items-center gap-2">
                                Sản phẩm tiêu biểu
                            </h3>
                            <div className="space-y-3">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-sm">
                                                <img src={`https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=100&q=80`} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">Combo Món Ngon #0{i+1}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-amber-500">
                                                    <Star size={10} fill="currentColor" /> 4.9 (120 lượt)
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-[#19454B]">Đang bán</span>
                                    </div>
                                ))}
                            </div>
                          </>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
