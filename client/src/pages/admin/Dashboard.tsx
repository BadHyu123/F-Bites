
import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Header, Button } from '../../components/Common';
import { User as UserIcon, Check, X, ShieldCheck, DollarSign, ShoppingBag } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { orders, approveShop, rejectShop } = useApp();
  const [tab, setTab] = useState<'STATS' | 'APPROVALS'>('APPROVALS');

  const pendingShops = [
      { id: 'u_new1', name: 'Tiệm Bánh Mới', shopName: 'Tiệm Bánh Mới', email: 'shop1@test.com', shopAddress: '123 Đường A', role: 'SELLER', isApproved: false },
      { id: 'u_new2', name: 'Cơm Tấm Đêm', shopName: 'Cơm Tấm Đêm', email: 'shop2@test.com', shopAddress: '456 Đường B', role: 'SELLER', isApproved: false }
  ];

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;

  const chartData = [
      { name: 'T2', pct: 40 },
      { name: 'T3', pct: 55 },
      { name: 'T4', pct: 30 },
      { name: 'T5', pct: 70 },
      { name: 'T6', pct: 60 },
      { name: 'T7', pct: 85 },
      { name: 'CN', pct: 95 },
  ];

    const [daily, setDaily] = useState<{ date: string; revenue: number }[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/revenue/daily', { headers: { 'Content-Type': 'application/json' } });
                if (!res.ok) return;
                const data = await res.json();
                setDaily(data.map((d: any) => ({ date: d.date.slice(5), revenue: Math.round(d.revenue / 1000) }))); // show in thousands
            } catch (e) {}
        };
        load();
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Admin Quản Trị" />

      <div className="bg-white p-1 flex shadow-sm mb-4 sticky top-14 z-20">
          <button 
            onClick={() => setTab('APPROVALS')}
            className={`flex-1 py-3 font-bold text-sm border-b-2 transition-colors ${tab === 'APPROVALS' ? 'border-[#19454B] text-[#19454B]' : 'border-transparent text-gray-400'}`}
          >
              Duyệt Shop ({pendingShops.length})
          </button>
          <button 
            onClick={() => setTab('STATS')}
            className={`flex-1 py-3 font-bold text-sm border-b-2 transition-colors ${tab === 'STATS' ? 'border-[#19454B] text-[#19454B]' : 'border-transparent text-gray-400'}`}
          >
              Báo cáo
          </button>
      </div>

      <div className="p-4">
          {tab === 'APPROVALS' && (
              <div className="space-y-4">
                  {pendingShops.length === 0 ? (
                      <div className="text-center text-gray-400 py-10">
                          <ShieldCheck size={48} className="mx-auto mb-3 opacity-30" />
                          <p>Hệ thống sạch sẽ! Không có shop chờ duyệt.</p>
                      </div>
                  ) : (
                      pendingShops.map(shop => (
                          <div key={shop.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <h3 className="font-bold text-[#19454B] text-lg">{shop.shopName}</h3>
                                      <p className="text-sm text-gray-500 flex items-center gap-1"><UserIcon size={12}/> {shop.name}</p>
                                  </div>
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase">Pending</span>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-600 space-y-1">
                                  <p>📧 {shop.email}</p>
                                  <p>📍 {shop.shopAddress}</p>
                                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                                      <div className="w-10 h-8 bg-gray-300 rounded flex items-center justify-center text-[10px] text-gray-500">Giấy phép</div>
                                      <span className="text-xs text-blue-600 underline">Xem chi tiết</span>
                                  </div>
                              </div>

                              <div className="flex gap-3">
                                  <Button 
                                    className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300" 
                                    onClick={() => {
                                        if(window.confirm("Từ chối shop này?")) rejectShop(shop.id);
                                    }}
                                  >
                                      <X size={18} className="mr-1"/> Từ chối
                                  </Button>
                                  <Button 
                                    className="flex-1 bg-green-600 hover:bg-green-700" 
                                    onClick={() => {
                                        approveShop(shop.id);
                                        alert("Đã duyệt shop thành công!");
                                    }}
                                  >
                                      <Check size={18} className="mr-1"/> Duyệt
                                  </Button>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          )}

          {tab === 'STATS' && (
              <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Tổng Doanh Thu</p>
                          <p className="text-xl font-bold text-[#19454B] flex items-center"><DollarSign size={16}/> {(totalRevenue/1000000).toFixed(1)}M</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Tổng Đơn Hàng</p>
                          <p className="text-xl font-bold text-[#FF7043] flex items-center"><ShoppingBag size={16}/> {totalOrders}</p>
                      </div>
                  </div>

                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                                <h3 className="font-bold text-sm mb-6 text-gray-700">Biểu đồ doanh thu (ngày)</h3>
                                                <div style={{ width: '100%', height: 220 }}>
                                                    <ResponsiveContainer>
                                                        <BarChart data={daily}>
                                                            <XAxis dataKey="date" />
                                                            <YAxis />
                                                            <Tooltip formatter={(v: any) => `${v}k`} />
                                                            <Bar dataKey="revenue" fill="#19454B" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                     </div>
              </div>
          )}
      </div>
    </div>
  );
};
