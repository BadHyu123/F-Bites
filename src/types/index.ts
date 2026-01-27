
export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export type NotificationChannel = 'EMAIL' | 'ZALO';

export interface UserLocation {
  province: string;
  district: string;
  ward: string;
  addressDisplay: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  shopId?: string; // Mã Shop
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  shopName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Trạng thái phê duyệt
  shopAddress?: string;
  licenseImage?: string;
  notificationChannel?: NotificationChannel;
  createdAt: string; // Ngày đăng ký
}

export interface WishlistItem {
  id: string;
  userId: string;
  keyword: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  expiryTime: string;
  quantity: number;
  category: string;
  distance?: number;
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  isDeleted?: boolean;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  total: number;
  shippingFee: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  type: 'DELIVERY' | 'PICKUP';
  pickupCode?: string;
  deliveryAddress?: string;
  note?: string;
  createdAt: string;
}

export interface Voucher {
  id: string;
  sellerId: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  minOrderValue: number;
  quantity: number;
  used: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
