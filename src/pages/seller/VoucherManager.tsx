
import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Header, Button, Input } from '../../components/Common';
import { Plus, CheckCircle2, History } from 'lucide-react';

export const VoucherManager: React.FC = () => {
  const { user, vouchers, addVoucher } = useApp();
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');

  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [qty, setQty] = useState('');
  const [type, setType] = useState<'PERCENT' | 'FIXED'>('PERCENT');

  const myVouchers = vouchers.filter(v => v.sellerId === user?.id);
  const activeVouchers = myVouchers.filter(v => v.isActive);
  const expiredVouchers = myVouchers.filter(v => !v.isActive);

  const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      if(!user) return;

      addVoucher({
          id: `v_${Date.now()}`,
          sellerId: user.id,
          code: code.toUpperCase(),
          type,
          value: Number(value),
          minOrderValue: Number(minOrder),
          quantity: Number(qty),
          used: 0,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000 * 7).toISOString(), 
          isActive: true
      });
      
      setCode(''); setValue(''); setMinOrder(''); setQty('');
      setView('LIST');
  };

  if (view === 'FORM') {
      return (
          <div className="min-h-screen bg-gray-50">
              <Header title="Tạo Mã Giảm Giá" back />
              <div className="p-4">
                  <form onSubmit={handleCreate} className="bg-white p-5 rounded-xl shadow-sm space-y-4">
                      <Input 
                        label="Mã Code (Tối đa 10 ký tự)" 
                        value={code} onChange={e => setCode(e.target.value.toUpperCase())} 
                        maxLength={10} placeholder="VD: TET2025" required 
                      />
                      
                      <div className="flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setType('PERCENT')}
                            className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm ${type === 'PERCENT' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-200 text-gray-500'}`}
                          >
                              Giảm theo %
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setType('FIXED')}
                            className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm ${type === 'FIXED' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-200 text-gray-500'}`}
                          >
                              Giảm tiền mặt
                          </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                           <Input 
                                label={type === 'PERCENT' ? "Mức giảm (%)" : "Số tiền (đ)"} 
                                type="number" value={value} onChange={e => setValue(e.target.value)} required 
                           />
                           <Input 
                                label="Số lượng mã" 
                                type="number" value={qty} onChange={e => setQty(e.target.value)} required 
                           />
                      </div>

                      <Input 
                            label="Đơn tối thiểu (đ)" 
                            type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} required 
                      />

                      <div className="pt-4 flex gap-3">
                          <Button type="button" variant="outline" onClick={() => setView('LIST')} className="flex-1">Hủy</Button>
                          <Button type="submit" variant="primary" className="flex-[2]">Tạo mã</Button>
                      </div>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Mã Giảm Giá" />
      
      <div className="p-4 space-y-6">
         <button 
            onClick={() => setView('FORM')}
            className="w-full bg-white border-2 border-dashed border-[#19454B] text-[#19454B] p-4 rounded-xl flex items-center justify-center gap-2 font-bold active:bg-teal-50"
         >
             <Plus size={20} /> Tạo mã giảm giá mới
         </button>

         <div>
             <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500"/> Đang hoạt động</h3>
             {activeVouchers.length === 0 ? <p className="text-gray-400 text-sm">Chưa có mã nào đang chạy.</p> : (
                 <div className="space-y-3">
                     {activeVouchers.map(v => (
                         <div key={v.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden">
                             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#19454B]"></div>
                             <div>
                                 <span className="font-black text-xl text-[#19454B] tracking-wider">{v.code}</span>
                                 <p className="text-sm text-gray-600">
                                     Giảm <b className="text-[#FF7043]">{v.type === 'PERCENT' ? `${v.value}%` : `${v.value/1000}k`}</b> • Đơn từ {v.minOrderValue/1000}k
                                 </p>
                                 <p className="text-xs text-gray-400 mt-1">HSD: {new Date(v.endDate).toLocaleDateString('vi-VN')}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs text-gray-400">Đã dùng</p>
                                 <p className="font-bold text-gray-800">{v.used}/{v.quantity}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
         </div>

         <div>
             <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><History size={18} className="text-gray-400"/> Đã hết hạn</h3>
             <div className="space-y-3 opacity-60 grayscale">
                 {expiredVouchers.map(v => (
                     <div key={v.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                         <div>
                             <span className="font-bold text-lg text-gray-600">{v.code}</span>
                             <p className="text-xs text-gray-500">Đã kết thúc</p>
                         </div>
                         <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">Hết hạn</span>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};
