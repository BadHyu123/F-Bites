
import React from 'react';
import { useApp } from '../../hooks/useApp';
import { Header, Button } from '../../components/Common';
import { Plus, Edit2, Trash2, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductList: React.FC = () => {
  const { user, products, deleteProduct } = useApp();
  const navigate = useNavigate();

  const myProducts = products.filter(p => p.sellerId === user?.id && !p.isDeleted);

  const handleDelete = (id: string) => {
      if(window.confirm('Bạn có chắc muốn xóa món này không?')) {
          deleteProduct(id);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      <Header title="Quản lý Món ăn" />

      <button 
        onClick={() => navigate('/seller/products/new')}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-[#19454B] rounded-full flex items-center justify-center shadow-2xl text-white active:scale-95 transition-transform"
      >
          <Plus size={30} />
      </button>

      <div className="p-4 space-y-4">
        {myProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Box size={48} className="mb-4 opacity-50" />
                <p>Bạn chưa đăng bán món nào.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/seller/products/new')}>Đăng món ngay</Button>
            </div>
        )}

        {myProducts.map(product => {
             const stockLow = product.quantity < 3;
             return (
                <div key={product.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 relative">
                        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                        {product.quantity === 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                                Hết hàng
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-[#19454B] line-clamp-1">{product.name}</h3>
                            <div className="flex items-end gap-2 mt-1">
                                <span className="font-bold text-[#FF7043]">{product.discountedPrice.toLocaleString()}đ</span>
                                <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()}đ</span>
                            </div>
                            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${stockLow ? 'text-red-500' : 'text-gray-600'}`}>
                                <Box size={12} />
                                Kho: {product.quantity}
                                {stockLow && <span className="bg-red-100 text-red-600 px-1 rounded text-[10px] ml-1">Sắp hết</span>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                             <button 
                                onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold active:bg-gray-200"
                             >
                                <Edit2 size={12} /> Sửa
                             </button>
                             <button 
                                onClick={() => handleDelete(product.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold active:bg-red-100"
                            >
                                <Trash2 size={12} /> Xóa
                             </button>
                        </div>
                    </div>
                </div>
             );
        })}
      </div>
    </div>
  );
};
