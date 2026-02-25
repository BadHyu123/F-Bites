
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Header, Button } from '../../components/Common';
import { QrCode, Check, X, MapPin, Package, MessageSquare, Truck, Store } from 'lucide-react';
import jsQR from 'jsqr';

export const SellerOrders: React.FC = () => {
  const { user, orders, updateOrderStatus } = useApp();
    const [inputCode, setInputCode] = useState('');
  const [activeTab, setActiveTab] = useState<'PENDING' | 'PROCESSING' | 'HISTORY'>('PENDING');
  const [scanMode, setScanMode] = useState(false);
    const [scannedText, setScannedText] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const myOrders = orders.filter(o => o.sellerId === user?.id);
  
  const pendingOrders = myOrders
    .filter(o => o.status === 'PENDING')
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const processingOrders = myOrders
    .filter(o => o.status === 'PREPARING' || o.status === 'READY')
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const historyOrders = myOrders
    .filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED')
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  useEffect(() => {
    if (!scanMode || !videoRef.current) return;
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          const scanFrame = () => {
            if (!videoRef.current || !canvasRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              const text = code.data;
              setScannedText(text);
              const found = processingOrders.find(o => (o.pickupCode || o.id) === text);
              if (found) {
                updateOrderStatus(found.id, 'COMPLETED');
                setScanMode(false);
                alert('Đã xác thực đơn hàng thành công!');
              } else {
                alert('Mã QR không khớp với đơn hàng chờ lấy.');
              }
              return;
            }
            
            if (scanMode) requestAnimationFrame(scanFrame);
          };
          
          requestAnimationFrame(scanFrame);
        }
      } catch (e) {
        alert('Không thể truy cập camera');
      }
    };
    
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [scanMode, processingOrders]);

  const currentList = activeTab === 'PENDING' ? pendingOrders : activeTab === 'PROCESSING' ? processingOrders : historyOrders;

  const timeAgo = (dateStr: string) => {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins} phút trước`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} giờ trước`;
      return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const TabButton = ({ id, label, count }: { id: typeof activeTab, label: string, count: number }) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors relative ${activeTab === id ? 'border-[#19454B] text-[#19454B]' : 'border-transparent text-gray-400'}`}
      >
          {label}
          {count > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full absolute top-2 right-2">{count}</span>}
      </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header 
        title="Quản lý Đơn hàng" 
        rightElement={
            <button onClick={() => setScanMode(true)} className="text-white p-2 hover:bg-white/10 rounded-full">
                <QrCode />
            </button>
        }
      />

      <div className="bg-white flex shadow-sm sticky top-14 z-20">
          <TabButton id="PENDING" label="Chờ xác nhận" count={pendingOrders.length} />
          <TabButton id="PROCESSING" label="Đang xử lý" count={processingOrders.length} />
          <TabButton id="HISTORY" label="Lịch sử" count={0} />
      </div>

      <div className="p-4 space-y-4">
                <div className="mb-4">
                    <div className="flex gap-2">
                        <input value={inputCode} onChange={e => setInputCode(e.target.value)} placeholder="Enter pickup code" className="flex-1 px-3 py-2 rounded-lg border" />
                        <button onClick={() => {
                                // try to find order by pickup code in local orders and complete it
                                const found = orders.find(o => (o.pickupCode || o.id) === inputCode && o.sellerId === user?.id);
                                if (found) {
                                    updateOrderStatus(found.id, 'COMPLETED');
                                    alert('Order marked as completed');
                                } else {
                                    alert('Order code not found');
                                }
                            }} className="px-4 py-2 rounded-lg bg-[#19454B] text-white">Verify</button>
                    </div>
                </div>
        {currentList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Package size={48} className="mb-4 opacity-30" />
                <p>Không có đơn hàng nào ở mục này.</p>
            </div>
        )}

        {currentList.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-600 text-sm">#{order.id.slice(-6)}</span>
                        <span className="text-xs text-gray-400">• {timeAgo(order.createdAt)}</span>
                    </div>
                    {order.type === 'DELIVERY' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            <Truck size={12}/> Giao hàng
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-teal-100 text-teal-700 px-2 py-1 rounded">
                            <Store size={12}/> Tự đến lấy
                        </span>
                    )}
                </div>

                <div className="p-4">
                    <div className="space-y-2 mb-3">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm">
                                <div className="flex gap-2">
                                    <span className="font-bold text-[#19454B]">{item.cartQuantity}x</span>
                                    <span className="text-gray-800">{item.name}</span>
                                </div>
                                <span className="text-gray-500 font-medium">{(item.discountedPrice * item.cartQuantity).toLocaleString()}đ</span>
                            </div>
                        ))}
                    </div>

                    {order.note && (
                        <div className="bg-yellow-50 p-2 rounded-lg text-xs text-yellow-800 flex items-start gap-2 mb-3 border border-yellow-100">
                            <MessageSquare size={14} className="mt-0.5 shrink-0"/>
                            <span className="italic">"{order.note}"</span>
                        </div>
                    )}

                    {order.type === 'DELIVERY' && order.deliveryAddress && (
                        <div className="flex items-start gap-2 text-xs text-gray-500 mb-3">
                            <MapPin size={14} className="mt-0.5 shrink-0"/>
                            <span>{order.deliveryAddress}</span>
                        </div>
                    )}
                    
                    <div className="w-full h-px bg-gray-100 my-3"></div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-400">Tổng tiền</p>
                            <p className="text-lg font-bold text-[#FF7043]">{order.total.toLocaleString()} đ</p>
                        </div>
                        
                        <div className="flex gap-2">
                            {order.status === 'PENDING' && (
                                <>
                                    <button 
                                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200"
                                    >
                                        Từ chối
                                    </button>
                                    <button 
                                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                        className="px-4 py-2 rounded-lg bg-[#19454B] text-white font-bold text-sm hover:bg-[#13353a] shadow-md shadow-teal-900/10"
                                    >
                                        Nhận đơn
                                    </button>
                                </>
                            )}

                            {order.status === 'PREPARING' && order.type === 'PICKUP' && (
                                <button 
                                    onClick={() => setScanMode(true)}
                                    className="px-4 py-2 rounded-lg bg-[#19454B] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-900/20"
                                >
                                    <QrCode size={16}/> Quét mã QR
                                </button>
                            )}

                             {order.type === 'DELIVERY' && (order.status === 'PREPARING' || order.status === 'READY') && (
                                <button 
                                    onClick={() => updateOrderStatus(order.id, 'READY')} 
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center gap-2 shadow-md hover:bg-blue-700"
                                >
                                    <Truck size={16}/> Gọi Shipper
                                </button>
                            )}

                            {(order.status === 'COMPLETED') && (
                                <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                                    <Check size={16}/> Hoàn tất
                                </span>
                            )}
                             {(order.status === 'CANCELLED') && (
                                <span className="text-red-500 text-sm font-bold flex items-center gap-1">
                                    <X size={16}/> Đã hủy
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {scanMode && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex flex-col items-center justify-center p-6 text-white animate-in fade-in">
            <h2 className="text-2xl font-bold mb-8">Quét mã nhận hàng</h2>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-80 h-80 bg-white rounded-2xl mb-6 object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <p className="text-gray-300 text-center mb-4">Di chuyển camera đến mã QR trên điện thoại của khách hàng.</p>
            <div className="flex gap-2 w-full max-w-xs">
                <Button fullWidth variant="outline" onClick={() => setScanMode(false)} className="border-white text-white hover:bg-white/10">Đóng Camera</Button>
                <button onClick={() => { if (scannedText) navigator.clipboard.writeText(scannedText); }} className="px-4 py-2 rounded-lg bg-white text-black">Sao chép</button>
            </div>
        </div>
      )}
      <style>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
    </div>
  );
};
