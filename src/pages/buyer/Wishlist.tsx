
import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Header, Button, Input } from '../../components/Common';
import { Bell, Trash2, MessageCircle, Mail } from 'lucide-react';

export const WishlistScreen: React.FC = () => {
  const { wishlist, addToWishlist, removeFromWishlist, user } = useApp();
  const [keyword, setKeyword] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      addToWishlist(keyword.trim());
      setKeyword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Wishlist & Thông báo" back />

      <div className="p-4 space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Bell size={20} className="text-[#FF6B35]" /> Kênh thông báo
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${user?.notificationChannel === 'ZALO' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200'}`}>
                    <MessageCircle size={18} /> Zalo
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${user?.notificationChannel === 'EMAIL' ? 'border-[#19454B] bg-teal-50 text-teal-700 font-bold' : 'border-gray-200'}`}>
                    <Mail size={18} /> Email
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Chúng tôi sẽ gửi thông báo ngay khi có món ăn khớp với từ khóa bên dưới.</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">Thêm từ khóa món ăn</h2>
            <form onSubmit={handleAdd} className="flex gap-2">
                <Input 
                    placeholder="VD: Cơm tấm, Bánh mì..." 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="py-2"
                />
                <Button type="submit" variant="secondary" className="py-2">Thêm</Button>
            </form>
        </div>

        <div>
            <h3 className="font-bold text-gray-700 mb-3">Danh sách quan tâm ({wishlist.length})</h3>
            {wishlist.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    Chưa có từ khóa nào. Hãy thêm món bạn thích!
                </div>
            ) : (
                <div className="grid gap-3">
                    {wishlist.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                            <div>
                                <span className="font-bold text-lg text-[#19454B]">{item.keyword}</span>
                                <p className="text-xs text-gray-400">Tạo lúc: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <button onClick={() => removeFromWishlist(item.id)} className="p-2 text-gray-400 hover:text-red-500">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
