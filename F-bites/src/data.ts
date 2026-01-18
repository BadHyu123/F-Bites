export const CATEGORIES = [
  { id: 1, name: "Tất cả", active: true },
  { id: 2, name: "Thịt/Cá", active: false }, // Cập nhật danh mục cho giống ảnh
  { id: 3, name: "Bánh ngọt", active: false },
  { id: 4, name: "Cơm/Bún", active: false },
];

export const PRODUCTS = [
  {
    id: 1,
    name: "Thịt Ba Chỉ Heo", 
    shopName: "Trư Bát Giới Shop",
    image: "https://th.bing.com/th/id/R.687d809ef27681fcce03ae561d93ad2e?rik=nbOo3DNxX3moyA&pid=ImgRaw&r=0", 
    originalPrice: 179000,
    salePrice: 100000,
    discount: 99,
    rating: 5,
    co2: 0.5,
    isSoldOut: false, // Còn hàng -> Hiện hạn sử dụng
    timeLeft: "Trong ngày" 
  },
  {
    id: 2,
    name: "Combo Bánh Mì + Bánh Ngọt",
    shopName: "Tiệm Bánh Cô Ba",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60",
    originalPrice: 65000,
    salePrice: 32000,
    discount: 51,
    rating: 4.8,
    co2: 0.5,
    isSoldOut: false,
    timeLeft: "23/06/2026"
  },
  {
    id: 3,
    name: "Bông Lan Trứng Muối",
    shopName: "Tiệm Bánh Iron Man",
    image: "https://daubepgiadinh.vn/wp-content/uploads/2017/03/bong-lan-trung-muoi-600x400.jpg",
    originalPrice: 50000,
    salePrice: 25000,
    discount: 50,
    rating: 4.5,
    co2: 0.3,
    isSoldOut: true, // Hết hàng -> Hiện Hết hàng (Không hiện hạn dùng)
    timeLeft: "Trong ngày"
  },
   {
    id: 4,
    name: "Bánh Chocopie",
    shopName: "Tiệm Bánh Choco Lover",
    image: "https://tse3.mm.bing.net/th/id/OIP.1SP4k-notFQ6YzcBnPJeIgHaE1?rs=1&pid=ImgDetMain&o=7&rm=3", // Ảnh minh họa socola
    originalPrice: 70000,
    salePrice: 35000,
    discount: 53,
    rating: 4.9,
    co2: 0.6,
    isSoldOut: false,
    timeLeft: "10/10/2026"
  },
];