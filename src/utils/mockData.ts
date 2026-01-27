
import { Product, Order, User } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn A', email: 'khachhang@test.com', role: 'BUYER', status: 'APPROVED', createdAt: '2023-10-01' },
  { id: 'u2', shopId: '001', name: 'Co.op mart', email: 'coop@test.com', role: 'SELLER', shopName: 'Co.op mart', status: 'PENDING', avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80', shopAddress: '49 Bát Đàn, Hoàn Kiếm, Hà Nội', phone: '0901234567', createdAt: '2023-11-15' },
  { id: 'u3', name: 'Admin Quản Trị', email: 'admin@test.com', role: 'ADMIN', status: 'APPROVED', createdAt: '2023-01-01' },
  { id: 'u4', shopId: '002', name: 'MacDonald', email: 'mac@test.com', role: 'SELLER', shopName: 'MacDonald', status: 'APPROVED', avatar: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=100&q=80', shopAddress: '49 Bát Đàn, Hoàn Kiếm, Hà Nội', phone: '0901234567', createdAt: '2023-11-16' },
  { id: 'u5', shopId: '003', name: 'Co.op mart', email: 'coop2@test.com', role: 'SELLER', shopName: 'Co.op mart', status: 'PENDING', shopAddress: '49 Bát Đàn, Hoàn Kiếm, Hà Nội', phone: '0901234567', createdAt: '2023-11-17' },
  { id: 'u6', shopId: '004', name: 'Co.op mart', email: 'coop3@test.com', role: 'SELLER', shopName: 'Co.op mart', status: 'PENDING', shopAddress: '49 Bát Đàn, Hoàn Kiếm, Hà Nội', phone: '0901234567', createdAt: '2023-11-18' },
  { id: 'u7', shopId: '005', name: 'Co.op mart', email: 'coop4@test.com', role: 'SELLER', shopName: 'Co.op mart', status: 'REJECTED', shopAddress: '49 Bát Đàn, Hoàn Kiếm, Hà Nội', phone: '0901234567', createdAt: '2023-11-19' },
  { id: 'u8', shopId: '006', name: 'Co.op mart', email: 'coop5@test.com', role: 'SELLER', shopName: 'Co.op mart', status: 'PENDING', shopAddress: '49 Bát Đàn, Hoàn Kiếm, Hà Nội', phone: '0901234567', createdAt: '2023-11-20' },
  { id: 'u9', shopId: '007', name: 'Circle K', email: 'circlek@test.com', role: 'SELLER', shopName: 'Circle K', status: 'PENDING', shopAddress: '12 Lê Lợi, Quận 1, HCM', phone: '0988776655', createdAt: '2023-11-21' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'u2',
    sellerName: 'Tiệm Bánh Cô Ba',
    name: 'Combo Bánh Mì + Bánh Ngọt',
    description: 'Bánh mì đặc ruột nướng mới sáng nay và 2 bánh croissant bơ tỏi. Vẫn còn giòn rụm.',
    originalPrice: 65000,
    discountedPrice: 32000,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80',
    expiryTime: new Date(Date.now() + 3600 * 1000 * 3).toISOString(),
    quantity: 5,
    category: 'Bánh ngọt',
    rating: 4.8,
    location: { lat: 10.7756, lng: 106.7020 },
    address: '42 Nguyễn Huệ, Quận 1'
  },
  {
    id: 'p2',
    sellerId: 'u2',
    sellerName: 'Tiệm Bánh Cô Ba',
    name: 'Bánh Bông Lan Trứng Muối',
    description: 'Ổ bánh 20cm, sốt phô mai chảy, trứng muối to. Hơi méo một chút do vận chuyển nhưng vị cực ngon.',
    originalPrice: 120000,
    discountedPrice: 60000,
    image: 'https://images.unsplash.com/photo-1621236378699-8597fac6a151?auto=format&fit=crop&w=400&q=80',
    expiryTime: new Date(Date.now() + 3600 * 1000 * 5).toISOString(),
    quantity: 2,
    category: 'Bánh ngọt',
    rating: 4.5,
    location: { lat: 10.7756, lng: 106.7020 },
    address: '42 Nguyễn Huệ, Quận 1'
  },
  {
    id: 'p3',
    sellerId: 'u4',
    sellerName: 'Cơm Tấm Sài Gòn',
    name: 'Cơm Tấm Sườn Bì Chả (Suất Lớn)',
    description: 'Suất cơm sườn nướng than hoa, bì thính nhà làm. Còn nóng hổi, cần giải cứu sau giờ trưa.',
    originalPrice: 75000,
    discountedPrice: 35000,
    image: 'https://images.unsplash.com/photo-1594970921471-158a474637d7?auto=format&fit=crop&w=400&q=80',
    expiryTime: new Date(Date.now() + 3600 * 1000 * 2).toISOString(),
    quantity: 8,
    category: 'Cơm/Bún',
    rating: 4.6,
    location: { lat: 10.7720, lng: 106.7045 },
    address: '15 Lê Lợi, Quận 1'
  },
    {
    id: 'p4',
    sellerId: 'u4',
    sellerName: 'Sushi Express',
    name: 'Set Sushi Cá Hồi (12 miếng)',
    description: 'Cá hồi tươi nhập khẩu Na Uy. Giảm giá sâu khung giờ vàng cuối ngày.',
    originalPrice: 250000,
    discountedPrice: 110000,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
    expiryTime: new Date(Date.now() + 3600 * 1000 * 1.5).toISOString(),
    quantity: 3,
    category: 'Sushi',
    rating: 4.9,
    location: { lat: 10.7790, lng: 106.6990 },
    address: '88 Pasteur, Quận 1'
  },
  {
    id: 'p5',
    sellerId: 'u5',
    sellerName: 'Phở Gia Truyền',
    name: 'Phở Bò Tái Nạm (Kèm Quẩy)',
    description: 'Nước dùng hầm xương 24h. Combo kèm quẩy giòn.',
    originalPrice: 65000,
    discountedPrice: 35000,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80',
    expiryTime: new Date(Date.now() + 3600 * 1000 * 1).toISOString(),
    quantity: 10,
    category: 'Cơm/Bún',
    rating: 4.3,
    location: { lat: 10.7765, lng: 106.7009 },
    address: '123 Lê Thánh Tôn, Quận 1'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'DH-11023',
    buyerId: 'u1',
    sellerId: 'u2',
    items: [{ ...MOCK_PRODUCTS[0], cartQuantity: 2 }],
    total: 79000, 
    shippingFee: 15000,
    status: 'PENDING',
    type: 'DELIVERY',
    deliveryAddress: 'Toà nhà Bitexco, Quận 1',
    note: 'Giao cho lễ tân giúp em nhé shop. Xin thêm tương ớt.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  },
  {
    id: 'DH-88921',
    buyerId: 'u1',
    sellerId: 'u2',
    items: [{ ...MOCK_PRODUCTS[1], cartQuantity: 1 }],
    total: 60000,
    shippingFee: 0,
    status: 'PREPARING',
    type: 'PICKUP',
    pickupCode: 'QR-88921',
    note: 'Lấy bánh còn nóng nha shop.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'DH-99214',
    buyerId: 'u1',
    sellerId: 'u2',
    items: [{ ...MOCK_PRODUCTS[0], cartQuantity: 3 }],
    total: 111000,
    shippingFee: 15000,
    status: 'READY', 
    type: 'DELIVERY',
    deliveryAddress: '123 Lê Lợi, Quận 1',
    note: 'Gọi trước khi giao.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() 
  },
  {
    id: 'DH-55102',
    buyerId: 'u1',
    sellerId: 'u2',
    items: [{ ...MOCK_PRODUCTS[0], cartQuantity: 1 }],
    total: 32000,
    shippingFee: 0,
    status: 'COMPLETED',
    type: 'PICKUP',
    pickupCode: 'QR-55102',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

export const VIETNAM_LOCATIONS = [
  {
    name: "Hồ Chí Minh",
    districts: [
      {
        name: "Quận 1",
        wards: ["Bến Nghé", "Bến Thành", "Cô Giang", "Cầu Kho", "Cầu Ông Lãnh", "Đa Kao", "Nguyễn Cư Trinh", "Nguyễn Thái Bình", "Phạm Ngũ Lão", "Tân Định"]
      },
      {
        name: "Quận 3",
        wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Võ Thị Sáu"]
      },
      {
        name: "Quận 7",
        wards: ["Tân Thuận Đông", "Tân Thuận Tây", "Tân Kiểng", "Tân Hưng", "Bình Thuận", "Phú Mỹ", "Phú Thuận", "Tân Phú", "Tân Phong", "Phú Mỹ Hưng"]
      },
      {
        name: "Bình Thạnh",
        wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 15", "Phường 17", "Phường 19", "Phường 21", "Phường 22", "Phường 24", "Phường 25"]
      }
    ]
  },
  {
    name: "Hà Nội",
    districts: [
      {
        name: "Ba Đình",
        wards: ["Phúc Xá", "Trúc Bạch", "Vĩnh Phúc", "Cống Vị", "Liễu Giai", "Nguyễn Trung Trực", "Quán Thánh", "Ngọc Hà", "Điện Biên", "Đội Cấn"]
      },
      {
        name: "Hoàn Kiếm",
        wards: ["Phúc Tân", "Đồng Xuân", "Hàng Mã", "Hàng Buồm", "Hàng Đào", "Hàng Bồ", "Cửa Đông", "Lý Thái Tổ", "Hàng Bạc", "Hàng Gai"]
      },
      {
        name: "Cầu Giấy",
        wards: ["Nghĩa Đô", "Nghĩa Tân", "Mai Dịch", "Dịch Vọng", "Dịch Vọng Hậu", "Quan Hoa", "Yên Hòa", "Trung Hòa"]
      }
    ]
  },
  {
    name: "Đà Nẵng",
    districts: [
      {
        name: "Hải Châu",
        wards: ["Thanh Bình", "Thuận Phước", "Thạch Thang", "Hải Châu I", "Hải Châu II", "Phước Ninh", "Hòa Thuận Tây", "Hòa Thuận Đông", "Nam Dương"]
      },
      {
        name: "Sơn Trà",
        wards: ["Thọ Quang", "Nại Hiên Đông", "Mân Thái", "An Hải Bắc", "Phước Mỹ", "An Hải Tây", "An Hải Đông"]
      }
    ]
  }
];
