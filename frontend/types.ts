export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export type NotificationChannel = 'EMAIL' | 'ZALO';

export interface UserLocation {
  province: string;
  district: string;
  ward: string;
  addressDisplay: string; // Formatted string for UI
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; // Added for Zalo
  role: Role;
  avatar?: string;
  shopName?: string; // For Sellers
  isApproved?: boolean; // For Sellers
  shopAddress?: string; // For Admin review
  licenseImage?: string; // For Admin review
  notificationChannel?: NotificationChannel; // Preference
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
  expiryTime: string; // ISO string
  quantity: number;
  category: string;
  distance?: number; // Calculated in runtime
  rating: number;
  location: { // Added for Map
    lat: number;
    lng: number;
  };
  address: string; // Added for display
  isDeleted?: boolean; // Soft delete
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
  pickupCode?: string; // QR content
  deliveryAddress?: string;
  note?: string; // Customer note
  createdAt: string;
}

export interface ShopStat {
  revenue: number;
  orders: number;
  saved: number; // kg of food saved
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
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