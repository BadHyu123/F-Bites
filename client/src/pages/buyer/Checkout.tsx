
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header, Button } from '../../components/Common';
import { useApp } from '../../hooks/useApp';
import { CreditCard, Copy, CheckCircle2, AlertCircle, ArrowRight, Heart } from 'lucide-react';
import QRCode from 'qrcode.react';

export const CheckoutScreen: React.FC = () => {
  const { state } = useLocation();
  const { placeOrder } = useApp();
  const navigate = useNavigate();
  
  const { 
    total = 0, 
    type = 'PICKUP', 
    paymentMethod = 'TRANSFER',
    address = '', 
    itemsCount = 0, 
    totalSaved = 0 
  } = state || {};

  const [timeLeft, setTimeLeft] = useState(paymentMethod === 'CASH' ? 1800 : 600);
  const [isDone, setIsDone] = useState(false);

  const bankInfo = {
    bankName: "MB Bank (Ngân hàng Quân Đội)",
    accountName: "F-BITES VIETNAM CO., LTD",
    accountNumber: "09887766554433",
    content: `FB${Math.floor(100000 + Math.random() * 900000)}`
  };

    const [pickupCode, setPickupCode] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép ${label}`);
  };

  const handleConfirm = () => {
        (async () => {
            // place order via context API
            const appliedVoucher = (state && state.appliedVoucher) || null;
            await placeOrder(type, address, appliedVoucher);
            // attempt to get latest orders and find most recent pickup code or id
            try {
                const resp = await fetch('http://localhost:5000/api/orders', { headers: { 'Content-Type': 'application/json' } });
                if (resp.ok) {
                    const os = await resp.json();
                    const latest = os && os.length ? os[0] : null;
                    if (latest && latest.type === 'PICKUP') setPickupCode(latest.pickupCode || latest.id);
                }
            } catch (e) {}
            setIsDone(true);
        })();
  };

  if (isDone) {
    return (
        <div className="fixed inset-0 z-50 bg-[#19454B] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/50 relative">
                 <div className="absolute inset-0 border-4 border-green-400 rounded-full animate-ping opacity-20"></div>
                 <Heart size={64} className="text-[#FF7043] fill-[#FF7043] animate-bounce" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
                {paymentMethod === 'CASH' ? 'Đã đặt hàng!' : 'Đã nhận thanh toán!'}
            </h2>
            <p className="text-teal-100 text-lg mb-8">Cảm ơn bạn đã đồng hành cùng F-bites.</p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-xs border border-white/20 mb-8">
                <div className="flex justify-around items-center">
                    <div>
                        <p className="text-2xl font-bold text-white">{itemsCount}</p>
                        <p className="text-[10px] text-teal-100">Món ngon</p>
                    </div>
                    <div className="h-8 w-px bg-white/20"></div>
                    <div>
                        <p className="text-2xl font-bold text-[#FF7043]">{totalSaved.toLocaleString()}đ</p>
                        <p className="text-[10px] text-teal-100">Tiết kiệm</p>
                    </div>
                </div>
            </div>
            
            <Button fullWidth onClick={() => navigate('/buyer/orders')} variant="outline" className="bg-white text-[#19454B] border-none hover:bg-gray-100">
                Xem mã nhận hàng <ArrowRight size={18} className="ml-2" />
            </Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Thanh toán" back />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-32">
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${paymentMethod === 'CASH' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
            <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'CASH' ? 'text-orange-600' : 'text-blue-600'}`}>
                    Trạng thái đơn hàng
                </span>
                <span className="text-lg font-black text-[#19454B]">
                    {paymentMethod === 'CASH' ? 'CHƯA THANH TOÁN' : 'CHỜ THANH TOÁN'}
                </span>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Hết hạn sau</p>
                <p className={`text-xl font-black ${paymentMethod === 'CASH' ? 'text-orange-600' : 'text-blue-600'}`}>
                    {formatTime(timeLeft)}
                </p>
            </div>
        </div>

        {paymentMethod === 'TRANSFER' ? (
            <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#19454B] to-teal-800 p-4 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <CreditCard size={18} className="text-teal-200" />
                            <span className="text-xs uppercase font-bold tracking-widest text-teal-100">Chuyển khoản VietQR</span>
                        </div>
                        <h3 className="font-bold">{bankInfo.bankName}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Số tài khoản</p>
                                <p className="text-xl font-mono font-black text-[#19454B]">{bankInfo.accountNumber}</p>
                            </div>
                            <button onClick={() => handleCopy(bankInfo.accountNumber, "số tài khoản")} className="p-2 bg-teal-50 text-[#19454B] rounded-lg"><Copy size={18} /></button>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Số tiền</p>
                                <p className="text-2xl font-black text-[#FF7043]">{total.toLocaleString()} đ</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Nội dung</p>
                                <p className="font-bold text-gray-800">{bankInfo.content}</p>
                            </div>
                            <button onClick={() => handleCopy(bankInfo.content, "nội dung")} className="p-2 bg-teal-50 text-[#19454B] rounded-lg"><Copy size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                    <h4 className="font-bold text-[#19454B] mb-4">Mã VietQR Thanh Toán</h4>
                            <div className="relative inline-block bg-white p-4 rounded-2xl border-2 border-[#19454B]/10 shadow-inner">
                                <div className="w-56 h-56 bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                                                                        {pickupCode ? (
                                                                            <QRCode value={String(pickupCode)} size={250} className="w-full h-full p-2" />
                                                                        ) : (
                                                                            <div className="text-sm text-gray-500">QR loading...</div>
                                                                        )}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-[scan_3s_infinite] opacity-60"></div>
                                </div>
                            </div>
                    <div className="mt-6 flex items-start gap-3 text-left bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800 font-medium">
                            Đơn hàng sẽ được xác nhận <b>ĐÃ THANH TOÁN</b> ngay sau khi hệ thống nhận được tiền.
                        </p>
                    </div>
                </div>
            </>
        ) : (
            <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF7043]"></div>
                    <h4 className="font-bold text-[#19454B] mb-2">Mã Nhận Hàng (Tiền mặt)</h4>
                    <p className="text-xs text-gray-400 mb-6 italic">Đưa mã này cho nhân viên khi đến quán</p>
                    
                    <div className="relative inline-block bg-white p-5 rounded-3xl border-2 border-[#FF7043]/20 shadow-xl mb-6">
                        <div className="w-48 h-48 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                            {pickupCode ? (
                                <QRCode value={String(pickupCode)} size={150} />
                            ) : (
                                <div className="text-sm text-gray-500">QR loading...</div>
                            )}
                        </div>
                        <div className="mt-4">
                             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Mã xác thực</span>
                             <span className="text-2xl font-black text-[#19454B] tracking-widest">{pickupCode}</span>
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-left space-y-2">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={20} className="text-orange-600 shrink-0 mt-0.5" />
                            <div>
                                <h5 className="text-sm font-bold text-orange-900">Thông báo quan trọng</h5>
                                <p className="text-xs text-orange-800 leading-relaxed mt-1">
                                    Quán sẽ chỉ giữ món cho bạn trong vòng <b>30 phút</b>. Vui lòng đến nhận đúng giờ để đảm bảo chất lượng món ăn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-4 border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-safe-area z-50">
          <Button fullWidth onClick={handleConfirm} className="h-14 rounded-2xl shadow-xl shadow-teal-900/10">
              {paymentMethod === 'CASH' ? (
                  <><CheckCircle2 size={20} className="mr-2" /> Xác nhận đặt món</>
              ) : (
                  <><CheckCircle2 size={20} className="mr-2" /> Tôi đã chuyển khoản thành công</>
              )}
          </Button>
          <button onClick={() => navigate(-1)} className="w-full py-3 text-gray-400 text-sm font-bold hover:text-[#19454B] transition-colors mt-1">
              Hủy và quay lại
          </button>
      </div>
      <style>
        {`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}
      </style>
    </div>
  );
};
