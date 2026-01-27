
import React, { useState, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  TrendingUp, DollarSign, Package, 
  Leaf, Users, ArrowUpRight, ArrowDownRight,
  Calendar, Download, Store, Flame,
  LayoutDashboard, ClipboardList, BarChart2,
  ChevronRight, ChevronLeft, Award, Trash2, Check, LogOut,
  UserPlus, ShieldAlert, PieChart, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminReports: React.FC = () => {
  const { orders, products, users, logout } = useApp();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [dateOffset, setDateOffset] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const menuItems = [
    { name: 'Duyệt người bán', icon: Users, path: '/admin' },
    { name: 'Quản lý Đơn Hàng', icon: ClipboardList, path: '/admin/orders' },
    { name: 'Quản lý tài khoản', icon: LayoutDashboard, path: '/admin/accounts' },
    { name: 'Báo cáo', icon: BarChart2, path: '/admin/reports', active: true },
  ];

  const handleLogout = () => {
    if(window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản Admin?')) {
        logout();
        navigate('/auth');
    }
  };

  const timeLabel = useMemo(() => {
    const now = new Date();
    if (timeRange === 'DAILY') {
        const d = new Date(now);
        d.setDate(d.getDate() + dateOffset);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    if (timeRange === 'WEEKLY') {
        const d = new Date(now);
        d.setDate(d.getDate() + (dateOffset * 7));
        const day = d.getDay() || 7;
        const start = new Date(d);
        start.setDate(d.getDate() - day + 1);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `${start.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`;
    }
    if (timeRange === 'MONTHLY') {
        const d = new Date(now.getFullYear(), now.getMonth() + dateOffset, 1);
        return d.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    }
    return "...";
  }, [dateOffset, timeRange]);

  const summary = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
    const totalRev = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const totalWaste = completedOrders.reduce((sum, o) => sum + (o.items.length * 0.8), 0); 
    const totalDiscount = orders.reduce((sum, o) => {
        const orderDiscount = o.items.reduce((s, i) => s + (i.originalPrice - i.discountedPrice) * i.cartQuantity, 0);
        return sum + orderDiscount;
    }, 0);

    return {
        revenue: totalRev,
        ordersCount: orders.length,
        wasteSaved: totalWaste.toFixed(1),
        totalDiscount: totalDiscount
    };
  }, [orders]);

  // Helper function để tính toán thang đo biểu đồ "đẹp"
  const getNiceScale = (values: number[]) => {
    const max = Math.max(...values, 10);
    const buffer = max * 1.25; // Thêm 25% khoảng trống phía trên
    let niceMax = Math.ceil(buffer / 10) * 10;
    if (niceMax > 100) niceMax = Math.ceil(buffer / 50) * 50;
    if (niceMax > 500) niceMax = Math.ceil(buffer / 100) * 100;
    
    const markers = [niceMax, niceMax * 0.75, niceMax * 0.5, niceMax * 0.25, 0].map(v => Math.round(v));
    return { niceMax, markers };
  };

  // Dữ liệu biểu đồ Doanh thu & Đơn hàng
  const chartData = useMemo(() => {
    let labels: string[] = [];
    let multiplier = 1;
    let baseOrders = 5;

    if (timeRange === 'DAILY') {
        labels = ['00h', '04h', '08h', '12h', '16h', '20h', '24h'];
        multiplier = 20;
        baseOrders = 2;
    } else if (timeRange === 'WEEKLY') {
        labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
        multiplier = 100;
        baseOrders = 15;
    } else {
        labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
        multiplier = 450;
        baseOrders = 80;
    }

    return labels.map((label, idx) => {
        const seed = (idx + 1) * (dateOffset + 10);
        const value = Math.abs((Math.sin(seed) * (multiplier * 0.3)) + multiplier);
        const orders = Math.abs((Math.cos(seed) * (baseOrders * 0.3)) + baseOrders);
        return { label, value, orders };
    });
  }, [timeRange, dateOffset]);

  // Tính thang đo cho biểu đồ 1
  const revenueScale = useMemo(() => getNiceScale(chartData.map(d => d.value)), [chartData]);
  const ordersScale = useMemo(() => getNiceScale(chartData.map(d => d.orders)), [chartData]);

  // Dữ liệu biểu đồ Tài khoản
  const accountChartData = useMemo(() => {
    let labels: string[] = [];
    let baseNew = 10;

    if (timeRange === 'DAILY') {
        labels = ['00h', '04h', '08h', '12h', '16h', '20h', '24h'];
        baseNew = 5;
    } else if (timeRange === 'WEEKLY') {
        labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        baseNew = 45;
    } else {
        labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
        baseNew = 180;
    }

    return labels.map((label, idx) => {
        const seed = (idx + 1) * (dateOffset + 5);
        const newUsers = Math.abs((Math.sin(seed) * (baseNew * 0.2)) + baseNew);
        const violations = Math.abs((Math.cos(seed) * (baseNew * 0.1)) + (baseNew / 10));
        return { label, newUsers, violations };
    });
  }, [timeRange, dateOffset]);

  // Tính thang đo cho biểu đồ 2
  const accountScale = useMemo(() => {
      const allVals = [...accountChartData.map(d => d.newUsers), ...accountChartData.map(d => d.violations)];
      return getNiceScale(allVals);
  }, [accountChartData]);

  const topSellers = useMemo(() => {
    const sellerStats: Record<string, { id: string, name: string, avatar?: string, rev: number, orders: number }> = {};
    orders.filter(o => o.status === 'COMPLETED').forEach(order => {
      if (!sellerStats[order.sellerId]) {
        const sellerUser = users.find(u => u.id === order.sellerId);
        sellerStats[order.sellerId] = {
          id: order.sellerId,
          name: sellerUser?.shopName || sellerUser?.name || 'Unknown Shop',
          avatar: sellerUser?.avatar,
          rev: 0,
          orders: 0
        };
      }
      sellerStats[order.sellerId].rev += order.total;
      sellerStats[order.sellerId].orders += 1;
    });
    return Object.values(sellerStats).sort((a, b) => b.rev - a.rev).slice(0, 6);
  }, [orders, users]);

  const topProducts = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [products]);

  // FIX: Added expiringSoon useMemo to resolve reference error in line 550
  const expiringSoon = useMemo(() => {
    const now = Date.now();
    return products
      .filter(p => {
        const expiry = new Date(p.expiryTime).getTime();
        return expiry > now && (expiry - now) < (2 * 3600 * 1000); // Trong vòng 2 giờ
      })
      .sort((a, b) => new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime());
  }, [products]);

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const rows = [
          ["Ky bao cao", timeLabel, ""],
          ["Tong doanh thu", summary.revenue.toLocaleString(), "VND"],
          ["Tong don hang", summary.ordersCount.toString(), "don"],
          ["Thuc pham cuu song", summary.wasteSaved, "kg"],
          ["", "", ""],
          ["TOP NGUOI BAN", "Doanh thu (VND)", "So don"],
          ...topSellers.map(s => [s.name, s.rev.toString(), s.orders.toString()])
        ];
        const csvContent = "\uFEFF" + rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `FBites-Report-${timeRange}-${timeLabel.replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) { alert("Lỗi xuất file"); } finally { setIsExporting(false); }
    }, 800);
  };

  // Logic tính toán "Đồ ăn được bán"
  const soldCategoryStats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
    const categoryMapping: Record<string, string> = {
        'Bánh ngọt': 'Bánh',
        'Cơm/Bún': 'Đồ gói',
        'Sushi': 'Đồ gói',
        'Đồ tươi': 'Đồ hộp',
        'Đồ uống': 'Thức uống'
    };
    
    const stats: Record<string, number> = {
        'Thức uống': 0,
        'Đồ hộp': 0,
        'Bánh': 0,
        'Đồ gói': 0,
        'Khác': 0
    };

    completedOrders.forEach(order => {
        order.items.forEach(item => {
            const mappedCat = categoryMapping[item.category] || 'Khác';
            stats[mappedCat] += item.cartQuantity;
        });
    });

    const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
    
    return Object.entries(stats)
        .map(([name, count]) => ({
            name, 
            count, 
            percent: Math.round((count / total) * 100)
        }))
        .filter(s => s.count > 0 || ['Thức uống', 'Bánh', 'Đồ gói'].includes(s.name)) // Luôn hiện các mốc chính
        .sort((a,b) => b.count - a.count);
  }, [orders]);

  const categoryColors: Record<string, string> = {
    'Bánh': '#19454B',
    'Thức uống': '#3B82F6',
    'Đồ hộp': '#FFB01F',
    'Đồ gói': '#FF7043',
    'Khác': '#94A3B8'
  };

  return (
    <div className="flex w-full h-screen bg-[#F0F2F5] font-sans">
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
          <h1 className="text-2xl font-black text-[#19454B]">Báo cáo hệ thống</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => { setTimeRange('DAILY'); setDateOffset(0); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${timeRange === 'DAILY' ? 'bg-white text-[#19454B] shadow-sm' : 'text-gray-500'}`}>Ngày</button>
                <button onClick={() => { setTimeRange('WEEKLY'); setDateOffset(0); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${timeRange === 'WEEKLY' ? 'bg-white text-[#19454B] shadow-sm' : 'text-gray-500'}`}>Tuần</button>
                <button onClick={() => { setTimeRange('MONTHLY'); setDateOffset(0); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${timeRange === 'MONTHLY' ? 'bg-white text-[#19454B] shadow-sm' : 'text-gray-500'}`}>Tháng</button>
            </div>
            
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 h-[38px] shadow-sm">
                <button onClick={() => setDateOffset(prev => prev - 1)} className="p-1.5 text-gray-400 hover:text-[#19454B] hover:bg-gray-50 rounded-lg transition-colors">
                    <ChevronLeft size={16} />
                </button>
                <span className="px-4 text-[11px] font-black text-[#19454B] uppercase tracking-wider border-x border-gray-100 h-full flex items-center min-w-[130px] justify-center text-center">
                    {timeLabel}
                </span>
                <button onClick={() => setDateOffset(prev => prev + 1)} className="p-1.5 text-gray-400 hover:text-[#19454B] hover:bg-gray-50 rounded-lg transition-colors">
                    <ChevronRight size={16} />
                </button>
            </div>

            <button 
                onClick={handleExportReport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-[#19454B] text-white rounded-xl text-xs font-bold hover:bg-[#13353a] transition-all shadow-lg shadow-teal-900/10 h-[38px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {isExporting ? 'Đang chuẩn bị...' : 'Xuất dữ liệu'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto no-scrollbar">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[
                { label: 'Doanh thu', value: `${(summary.revenue / 1000000).toFixed(1)}M`, sub: '+12.5%', up: true, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Đơn hàng', value: summary.ordersCount, sub: '+8.2%', up: true, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Thực phẩm cứu sống', value: `${summary.wasteSaved}kg`, sub: '+24%', up: true, icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Tổng Discount', value: `${(summary.totalDiscount / 1000).toFixed(0)}k`, sub: '-2.1%', up: false, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon size={24} />
                        </div>
                        <div className={`flex items-center gap-0.5 text-[10px] font-black ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stat.sub}
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-[#19454B]">{stat.value}</p>
                </div>
            ))}
          </div>

          {/* Charts Row 1: Dynamic Revenue & Accounts */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-xl font-black text-[#19454B]">Biến động Doanh thu & Đơn hàng</h3>
                        <p className="text-xs text-gray-400 font-bold italic">Xem theo {timeRange === 'DAILY' ? 'Giờ' : timeRange === 'WEEKLY' ? 'Thứ' : 'Tuần'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#19454B] rounded-full"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doanh thu</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#FF7043] rounded-full"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đơn hàng</span>
                        </div>
                    </div>
                </div>

                <div className="flex h-[280px] w-full relative pt-4">
                    <div className="flex flex-col justify-between h-[240px] pr-4 text-right border-r border-gray-50 w-16 shrink-0">
                        {revenueScale.markers.map(m => <span key={m} className="text-[10px] font-black text-gray-300">{(m/1000).toFixed(1)}k</span>)}
                    </div>
                    <div className="flex-1 flex items-end justify-between px-2 h-[240px] relative">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 w-full group relative z-10">
                                <div className="w-full flex justify-center items-end gap-1.5 h-[240px]">
                                    <div className="w-full max-w-[20px] bg-[#19454B] rounded-t-lg transition-all duration-700 relative" style={{ height: `${(d.value / revenueScale.niceMax) * 100}%` }}>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#19454B] text-white text-[8px] px-1 rounded transition-opacity whitespace-nowrap">{Math.round(d.value)}k</div>
                                    </div>
                                    <div className="w-full max-w-[20px] bg-[#FF7043] rounded-t-lg transition-all duration-700 delay-100 relative" style={{ height: `${(d.orders / ordersScale.niceMax) * 100}%` }}>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#FF7043] text-white text-[8px] px-1 rounded transition-opacity whitespace-nowrap">{Math.round(d.orders)}đh</div>
                                    </div>
                                </div>
                                <span className="absolute -bottom-8 text-[9px] font-black text-gray-400 whitespace-nowrap">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Account Activity Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-xl font-black text-[#19454B]">Biến động Tài khoản</h3>
                        <p className="text-xs text-gray-400 font-bold italic">Tốc độ tăng trưởng kỳ này</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <UserPlus size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Mới</span>
                        </div>
                        <div className="flex items-center gap-2 text-rose-500">
                            <ShieldAlert size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Vi phạm</span>
                        </div>
                    </div>
                </div>

                <div className="flex h-[280px] w-full relative pt-4">
                    <div className="flex flex-col justify-between h-[240px] pr-4 text-right border-r border-gray-50 w-16 shrink-0">
                        {accountScale.markers.map(m => <span key={m} className="text-[10px] font-black text-gray-300">{m}</span>)}
                    </div>
                    <div className="flex-1 flex items-end justify-between px-2 h-[240px] relative">
                        {accountChartData.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 w-full group relative z-10">
                                <div className="w-full flex justify-center items-end gap-1.5 h-[240px]">
                                    <div className="w-full max-w-[20px] bg-emerald-50 rounded-t-lg transition-all duration-700 relative" style={{ height: `${(d.newUsers / accountScale.niceMax) * 100}%` }}>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-emerald-600 text-white text-[8px] px-1 rounded transition-opacity whitespace-nowrap">+{Math.round(d.newUsers)}</div>
                                    </div>
                                    <div className="w-full max-w-[20px] bg-rose-400 rounded-t-lg transition-all duration-700 delay-100 relative" style={{ height: `${(d.violations / accountScale.niceMax) * 100}%` }}>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-rose-600 text-white text-[8px] px-1 rounded transition-opacity whitespace-nowrap">{Math.round(d.violations)}</div>
                                    </div>
                                </div>
                                <span className="absolute -bottom-8 text-[9px] font-black text-gray-400 whitespace-nowrap">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* Row 2: Sold Categories & Top Sellers */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <PieChart className="text-[#19454B]" size={24} />
                    <h3 className="text-lg font-black text-[#19454B]">Đồ ăn được bán</h3>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48 mb-8">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            {soldCategoryStats.length > 0 ? soldCategoryStats.reduce((acc, stat, i) => {
                                let offset = 0;
                                for(let j=0; j<i; j++) offset += soldCategoryStats[j].percent;
                                return [
                                    ...acc,
                                    <circle
                                        key={i} cx="18" cy="18" r="15.915" fill="transparent"
                                        stroke={categoryColors[stat.name] || '#CBD5E1'}
                                        strokeWidth="3.5" strokeDasharray={`${stat.percent} ${100 - stat.percent}`}
                                        strokeDashoffset={-offset} className="transition-all duration-1000"
                                    />
                                ];
                            }, [] as any) : <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F1F5F9" strokeWidth="3" />}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-[#19454B]">{summary.ordersCount}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đơn hàng</span>
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        {soldCategoryStats.map((stat, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[stat.name] }}></div>
                                    <span className="text-xs font-bold text-gray-600">{stat.name}</span>
                                </div>
                                <span className="text-xs font-black text-[#19454B]">{stat.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-[#19454B]">Bảng xếp hạng Người bán</h3>
                    <button className="text-xs font-bold text-[#FF7043] hover:underline">Xem tất cả</button>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                    {topSellers.map((seller, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all">
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm">
                                    {seller.avatar ? <img src={seller.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center font-bold text-gray-300">{seller.name[0]}</div>}
                                </div>
                                <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#19454B] rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white">
                                    {i + 1}
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="text-sm font-black text-[#19454B] truncate group-hover:text-[#FF7043] transition-colors">{seller.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400" style={{ width: `${100 - i * 15}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{seller.orders} đơn</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-[#19454B]">{(seller.rev / 1000).toFixed(0)}k</p>
                                <p className="text-[10px] text-emerald-500 font-bold">Thành công</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Row 3: Product Alerts */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#19454B]">Top Món được săn đón</h3>
                    <TrendingUp className="text-emerald-500" size={20} />
                </div>
                <div className="space-y-4">
                    {topProducts.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0">
                                    <img src={p.image} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#19454B]">{p.name}</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase">{p.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-amber-500 mb-1">
                                    <Award size={14} fill="currentColor" />
                                    <span className="text-xs font-black">{p.rating}</span>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Đã cứu 100+</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#19454B]">Cảnh báo rủi ro thực phẩm</h3>
                    <Flame className="text-rose-500 animate-pulse" size={20} />
                </div>
                <div className="space-y-4">
                    {expiringSoon.length > 0 ? expiringSoon.slice(0, 3).map((p, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm shrink-0">
                                <img src={p.image} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-black text-rose-900">{p.name}</h4>
                                <p className="text-[10px] text-rose-700 font-bold uppercase">Hết hạn sau: {Math.floor((new Date(p.expiryTime).getTime() - Date.now()) / 60000)}p</p>
                            </div>
                            <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-rose-700 transition-colors">
                                Gửi NOTIFY
                            </button>
                        </div>
                    )) : (
                        <div className="text-center py-10 opacity-30">
                            <Check className="mx-auto mb-2 text-emerald-500" size={32} />
                            <p className="text-xs font-bold text-[#19454B] uppercase">Kênh giải cứu ổn định</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
