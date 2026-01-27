
import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  Search, X, Check, 
  ChevronLeft, ChevronRight, LayoutDashboard, 
  ClipboardList, Users, BarChart2, Leaf, Info, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { users, approveShop, rejectShop, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const menuItems = [
    { name: 'Duyệt người bán', icon: Users, path: '/admin', active: true },
    { name: 'Quản lý Đơn Hàng', icon: ClipboardList, path: '/admin/orders' },
    { name: 'Quản lý tài khoản', icon: LayoutDashboard, path: '/admin/accounts' },
    { name: 'Báo cáo', icon: BarChart2, path: '/admin/reports' },
  ];

  const handleLogout = () => {
    if(window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản Admin?')) {
        logout();
        navigate('/auth');
    }
  };

  const sellers = users.filter(u => u.role === 'SELLER');
  const filteredSellers = sellers.filter(seller => {
    const matchSearch = (seller.shopName?.toLowerCase() || seller.name.toLowerCase()).includes(search.toLowerCase()) || 
                       seller.shopId?.includes(search);
    const matchTab = activeTab === 'ALL' ? true : seller.status === activeTab;
    return matchSearch && matchTab;
  });

  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
  const currentSellers = filteredSellers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex w-full h-screen bg-[#E5E5E5] font-sans">
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
          <h1 className="text-2xl font-black text-[#19454B]">Duyệt người bán</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-[450px]">
              <input 
                type="text" 
                placeholder="Tìm kiếm người bán, người mua,..." 
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
          <div className="flex justify-between items-center mb-6">
            <div className="flex p-1 bg-[#D9D9D9] rounded-xl shadow-inner">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'PENDING', label: 'Chờ duyệt' },
                { id: 'APPROVED', label: 'Đã duyệt' },
                { id: 'REJECTED', label: 'Từ chối' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setCurrentPage(1); }}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-[#19454B] text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 font-bold">Tìm thấy {filteredSellers.length} kết quả</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-gray-100">
                  <tr className="text-gray-400 text-xs font-black uppercase tracking-wider">
                    <th className="px-8 py-5">Người bán</th>
                    <th className="px-4 py-5">Mã Shop</th>
                    <th className="px-4 py-5">Liên hệ</th>
                    <th className="px-4 py-5">Địa chỉ</th>
                    <th className="px-4 py-5">Ngày đăng ký</th>
                    <th className="px-4 py-5">Trạng thái</th>
                    <th className="px-8 py-5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentSellers.map((seller) => (
                    <tr key={seller.id} className="text-sm text-gray-600 hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            {seller.avatar ? <img src={seller.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-300">{seller.shopName?.[0]}</div>}
                          </div>
                          <span className="font-bold text-[#19454B]">{seller.shopName || seller.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400 font-medium">{seller.shopId || '---'}</td>
                      <td className="px-4 py-4 font-medium">{seller.phone || seller.email}</td>
                      <td className="px-4 py-4 text-[11px] text-gray-400 font-medium max-w-[200px]">
                        {seller.shopAddress || '---'}
                      </td>
                      <td className="px-4 py-4 text-[11px] text-gray-400 font-medium">
                        {seller.createdAt}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                          seller.status === 'PENDING' ? 'bg-[#FFB01F] text-white' : 
                          seller.status === 'APPROVED' ? 'bg-[#55D284] text-white' : 
                          'bg-[#FF6D6D] text-white'
                        }`}>
                          {seller.status === 'PENDING' ? 'Chờ Duyệt' : seller.status === 'APPROVED' ? 'Đã Duyệt' : 'Từ Chối'}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center justify-center gap-3">
                           {seller.status === 'PENDING' ? (
                             <>
                                <button 
                                    onClick={() => rejectShop(seller.id)}
                                    className="w-8 h-8 bg-[#FF6D6D] text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                                <button 
                                    onClick={() => approveShop(seller.id)}
                                    className="px-4 py-1.5 bg-[#19454B] text-white rounded-lg text-[10px] font-bold hover:scale-105 transition-transform shadow-sm"
                                >
                                    Phê Duyệt
                                </button>
                             </>
                           ) : (
                             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                                <Info size={20} fill="currentColor" />
                             </div>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-auto px-8 py-6 bg-white flex justify-between items-center border-t border-gray-100">
              <p className="text-[11px] text-gray-400 font-bold">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(filteredSellers.length, currentPage * itemsPerPage)} trên tổng số {filteredSellers.length}
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >Sau</button>
                <button className="w-8 h-8 rounded-lg text-xs font-bold bg-[#19454B] text-white shadow-md">1</button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >Tiếp</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
