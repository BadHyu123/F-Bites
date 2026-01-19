
import React from 'react';
import { Header } from '../../components/Header';
import { useApp } from '../../hooks/useApp';
import { Package, DollarSign, Leaf, Ticket, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'T2', sales: 400000, pct: 40 },
  { name: 'T3', sales: 300000, pct: 30 },
  { name: 'T4', sales: 200000, pct: 20 },
  { name: 'T5', sales: 278000, pct: 28 },
  { name: 'T6', sales: 189000, pct: 19 },
  { name: 'T7', sales: 239000, pct: 24 },
  { name: 'CN', sales: 349000, pct: 35 },
];

export const SellerDashboard: React.FC = () => {
  const { user, orders } = useApp();
  const navigate = useNavigate();
  
  const myOrders = orders.filter(o => o.sellerId === user?.id);
  const pendingOrders = myOrders.filter(o => o.status === 'PENDING').length;
  const totalRevenue = myOrders.reduce((acc, curr) => acc + curr.total, 0);

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-xs font-medium uppercase">{label}</p>
            <p className="text-xl font-bold mt-1 text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            <Icon size={20} className="text-white" />
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Tổng quan Shop" />
      
      <div className="p-4 space-y-4">
        <div 
            onClick={() => navigate('/seller/vouchers')}
            className="bg-[#19454B] text-white p-4 rounded-xl flex items-center justify-between shadow-lg shadow-teal-900/20 active:scale-95 transition-transform cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                    <Ticket size={24} />
                </div>
                <div>
                    <h3 className="font-bold">Quản lý Voucher</h3>
                    <p className="text-xs text-teal-200">Tạo mã giảm giá để hút khách</p>
                </div>
            </div>
            <ChevronRight />
        </div>

        <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#19454B]" />
            Hoạt động hôm nay
        </h2>
        <div className="grid grid-cols-2 gap-3">
            <StatCard label="Doanh thu" value={`${(totalRevenue/1000).toFixed(0)}k`} icon={DollarSign} color="bg-green-500" />
            <StatCard label="Đơn chờ" value={pendingOrders} icon={Package} color="bg-orange-500" />
            <StatCard label="Giảm CO2" value="12kg" icon={Leaf} color="bg-teal-500" />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-sm text-gray-800">Doanh thu tuần này</h3>
                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">+12.5%</span>
             </div>
             
             {/* CSS Bar Chart */}
             <div className="flex items-end justify-between h-48 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-gray-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                            <div 
                                className={`w-full transition-all duration-500 rounded-t-lg group-hover:opacity-80 ${index === 6 ? 'bg-[#FF7043]' : 'bg-[#19454B]'}`}
                                style={{ height: `${item.pct * 2}%` }}
                            ></div>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {(item.sales/1000).toFixed(0)}k
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold ${index === 6 ? 'text-[#FF7043]' : 'text-gray-400'}`}>
                            {item.name}
                        </span>
                    </div>
                ))}
             </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <div className="bg-blue-200 p-2 rounded-lg text-blue-800 font-bold text-xs shrink-0">LƯU Ý</div>
            <div>
                <h4 className="font-bold text-blue-900 text-sm">Cảnh báo tồn kho</h4>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                    Bạn có 3 món sẽ hết hạn trong 1 giờ tới. Hãy xem xét giảm giá sâu hơn để đẩy hàng nhanh chóng.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
