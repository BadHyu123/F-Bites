
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Product, CartItem, Order, Role, WishlistItem, UserLocation, Voucher } from '../types';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS } from '../utils/mockData';

export interface AppContextType {
  user: User | null;
  users: User[];
  login: (identifier: string, type: 'EMAIL' | 'PHONE', role: Role) => void;
  logout: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (type: 'DELIVERY' | 'PICKUP', address?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  wishlist: WishlistItem[];
  addToWishlist: (keyword: string) => void;
  removeFromWishlist: (id: string) => void;
  userLocation: UserLocation;
  updateUserLocation: (loc: Partial<UserLocation>) => void;
  vouchers: Voucher[];
  addVoucher: (voucher: Voucher) => void;
  approveShop: (userId: string) => void;
  rejectShop: (userId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fbites_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('fbites_all_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fbites_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('fbites_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('fbites_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('fbites_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('fbites_vouchers');
    return saved ? JSON.parse(saved) : [];
  });

  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    const saved = localStorage.getItem('fbites_location');
    return saved ? JSON.parse(saved) : {
      province: "Hồ Chí Minh",
      district: "Quận 1",
      ward: "Bến Nghé",
      addressDisplay: "Bến Nghé, Quận 1, Hồ Chí Minh",
      lat: 10.7756,
      lng: 106.7020
    };
  });

  useEffect(() => localStorage.setItem('fbites_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('fbites_all_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('fbites_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('fbites_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('fbites_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('fbites_wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('fbites_location', JSON.stringify(userLocation)), [userLocation]);
  useEffect(() => localStorage.setItem('fbites_vouchers', JSON.stringify(vouchers)), [vouchers]);

  const login = (identifier: string, type: 'EMAIL' | 'PHONE', role: Role) => {
    let foundUser = users.find(u => 
      (type === 'EMAIL' && u.email === identifier) || 
      (type === 'PHONE' && u.phone === identifier)
    );

    if (!foundUser || foundUser.role !== role) {
      foundUser = {
        id: `new_${Date.now()}`,
        name: type === 'EMAIL' ? identifier.split('@')[0] : `User ${identifier.slice(-4)}`,
        email: type === 'EMAIL' ? identifier : '',
        phone: type === 'PHONE' ? identifier : '',
        role,
        shopName: role === 'SELLER' ? 'Cửa hàng mới' : undefined,
        status: role === 'SELLER' ? 'PENDING' : 'APPROVED',
        createdAt: new Date().toISOString().split('T')[0],
        notificationChannel: type === 'PHONE' ? 'ZALO' : 'EMAIL'
      };
      setUsers(prev => [...prev, foundUser!]); 
    }
    setUser(foundUser);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + quantity } : item);
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (type: 'DELIVERY' | 'PICKUP', address?: string) => {
    if (!user || cart.length === 0) return;
    
    const itemsBySeller: Record<string, CartItem[]> = {};
    cart.forEach(item => {
        if (!itemsBySeller[item.sellerId]) {
            itemsBySeller[item.sellerId] = [];
        }
        itemsBySeller[item.sellerId].push(item);
    });

    const newOrders: Order[] = Object.keys(itemsBySeller).map(sellerId => {
        const items = itemsBySeller[sellerId];
        const subTotal = items.reduce((sum, item) => sum + (item.discountedPrice * item.cartQuantity), 0);
        const shippingFee = type === 'DELIVERY' ? 15000 : 0; 

        return {
            id: `DH-${Math.floor(Math.random() * 100000)}`,
            buyerId: user.id,
            sellerId: sellerId,
            items: items,
            total: subTotal + shippingFee,
            shippingFee,
            status: 'PENDING',
            type,
            deliveryAddress: address,
            pickupCode: type === 'PICKUP' ? `QR-${Math.floor(Math.random() * 1000000)}` : undefined,
            createdAt: new Date().toISOString()
        };
    });

    setOrders(prev => [...newOrders, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const deleteProduct = (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addToWishlist = (keyword: string) => {
    if(!user) return;
    setWishlist(prev => [...prev, { id: `w_${Date.now()}`, userId: user.id, keyword, createdAt: new Date().toISOString() }]);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
  };
  
  const updateUserLocation = (loc: Partial<UserLocation>) => {
      setUserLocation(prev => ({ ...prev, ...loc }));
  };

  const addVoucher = (voucher: Voucher) => {
      setVouchers(prev => [voucher, ...prev]);
  };

  const approveShop = (userId: string) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'APPROVED' } : u));
  };

  const rejectShop = (userId: string) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'REJECTED' } : u));
  };

  return (
    <AppContext.Provider value={{
      user, users, login, logout,
      products, setProducts, cart, addToCart, removeFromCart, clearCart,
      orders, placeOrder, updateOrderStatus, addProduct, deleteProduct,
      wishlist, addToWishlist, removeFromWishlist,
      userLocation, updateUserLocation,
      vouchers, addVoucher,
      approveShop, rejectShop
    }}>
      {children}
    </AppContext.Provider>
  );
};
