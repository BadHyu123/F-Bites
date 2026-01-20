
import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Header, Button, Input } from '../../components/Common';
import { Product } from '../../types';
import { useNavigate, useParams } from 'react-router-dom';
import { Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export const ProductForm: React.FC = () => {
  const { user, addProduct, products, setProducts } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Bánh ngọt');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && products && id) {
      const productToEdit = products.find((p: Product) => p.id === id);
      if (productToEdit) {
        setName(productToEdit.name);
        setDesc(productToEdit.description);
        setOriginalPrice(productToEdit.originalPrice.toString());
        setDiscountPrice(productToEdit.discountedPrice.toString());
        setQuantity(productToEdit.quantity.toString());
        setCategory(productToEdit.category);
        setPreviewImage(productToEdit.image);
      } else {
          navigate('/seller/products');
      }
    }
  }, [id, isEdit, products, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!previewImage) {
        alert("Vui lòng tải ảnh món ăn lên.");
        return;
    }

    const productData: Product = {
      id: isEdit ? id! : `p_${Date.now()}`,
      sellerId: user.id,
      sellerName: user.shopName || 'Cửa hàng',
      name,
      description: desc,
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountPrice),
      quantity: Number(quantity),
      category,
      image: previewImage,
      expiryTime: new Date(Date.now() + 3600 * 1000 * 4).toISOString(),
      rating: 5.0,
      location: { lat: 10.7769, lng: 106.7009 },
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
    };

    if (isEdit) {
      const updatedProducts = products.map((p: Product) => p.id === id ? productData : p);
      setProducts(updatedProducts);
      alert("Đã cập nhật thông tin món ăn!");
    } else {
      addProduct(productData);
      alert("Đã đăng bán món ăn thành công!");
    }

    navigate('/seller/products');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title={isEdit ? "Chỉnh sửa món ăn" : "Đăng bán món mới"} back />
      
      <form onSubmit={handleSubmit} className="p-4 space-y-5">
        
        <div className="relative">
            <label className="block text-sm font-bold text-[#19454B] mb-2">Hình ảnh sản phẩm *</label>
            <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center overflow-hidden relative cursor-pointer hover:bg-teal-50/50 transition-colors">
                {previewImage ? (
                    <>
                        <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }} 
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 z-10"
                        >
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <>
                         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-[#19454B]">
                            <ImageIcon size={24} />
                         </div>
                         <p className="text-sm text-gray-500 font-medium">Chạm để tải ảnh lên</p>
                         <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tight">JPG, PNG (Max 5MB)</p>
                    </>
                )}
                <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                />
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
             <Input label="Tên món ăn *" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Bánh mì thịt nguội" required />
             
             <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-bold text-[#19454B]">Danh mục</label>
                <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#19454B] focus:outline-none bg-white text-sm font-medium"
                >
                    <option value="Bánh ngọt">Bánh ngọt</option>
                    <option value="Cơm/Bún">Cơm/Bún</option>
                    <option value="Đồ tươi">Đồ tươi</option>
                    <option value="Đồ uống">Đồ uống</option>
                    <option value="Sushi">Sushi</option>
                </select>
             </div>

             <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[#19454B]">Mô tả tình trạng món</label>
                <textarea 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                    placeholder="VD: Bánh mới ra lò sáng nay, còn rất thơm, bao bì móp nhẹ..." 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#19454B] focus:outline-none bg-white text-sm min-h-[100px]"
                />
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-[#19454B] text-sm flex items-center gap-2">
                <AlertCircle size={14} className="text-[#FF7043]" /> Giá & Tồn kho
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Giá gốc (đ) *" type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} required />
                <Input label="Giá ưu đãi (đ) *" type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} className="font-bold text-[#FF7043]" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Số lượng tồn *" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                <div className="flex flex-col gap-1">
                     <label className="text-sm font-bold text-[#19454B]">Tự động kết thúc</label>
                     <select className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm">
                         <option>Sau 4 giờ</option>
                         <option>Sau 8 giờ</option>
                         <option>Cuối ngày</option>
                     </select>
                </div>
            </div>
        </div>

        <div className="pt-2">
            <Button fullWidth type="submit" variant="primary" className="h-14 text-lg">
                {isEdit ? 'Cập nhật thay đổi' : 'Đăng bán ngay'}
            </Button>
            <Button 
                fullWidth 
                type="button" 
                variant="outline" 
                className="mt-3 border-none text-gray-400" 
                onClick={() => navigate('/seller/products')}
            >
                Hủy và Quay lại
            </Button>
        </div>
      </form>
    </div>
  );
};
