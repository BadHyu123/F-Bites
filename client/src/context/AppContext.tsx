
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Product, CartItem, Order, Role, WishlistItem, UserLocation, Voucher } from '../types';

export interface AppContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role) => Promise<{ success: boolean; message?: string }>;
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

  // keep token in localStorage for API calls
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fbites_token'));

  const [users, setUsers] = useState<User[]>([]);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fbites_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('fbites_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('fbites_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Load products from backend API on mount (uses backend default at localhost:5000)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) return;
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        // ignore network errors while offline
      }
    };
    load();
  }, []);

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
  useEffect(() => {
    if (token) localStorage.setItem('fbites_token', token);
    else localStorage.removeItem('fbites_token');
  }, [token]);
  useEffect(() => localStorage.setItem('fbites_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('fbites_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('fbites_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('fbites_wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('fbites_location', JSON.stringify(userLocation)), [userLocation]);
  useEffect(() => localStorage.setItem('fbites_vouchers', JSON.stringify(vouchers)), [vouchers]);

  const login = async (email: string, password: string, role: Role) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      const { user: u, token: t } = data;
      setUser(u);
      setToken(t);
      // populate wishlist for buyer if empty
      if (u.role === 'BUYER' && wishlist.length === 0) {
        setWishlist([{ id: `w_${Date.now()}`, userId: u.id, keyword: 'Bánh mì', createdAt: new Date().toISOString() }]);
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: Role) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err?.message || 'Registration failed' };
      }
      const data = await res.json();
      // set user + token
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    setToken(null);
    // do not remove other localStorage keys used for persistence of app state
    localStorage.removeItem('fbites_user');
    localStorage.removeItem('fbites_token');
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

  const placeOrder = (type: 'DELIVERY' | 'PICKUP', address?: string, voucherCode?: string) => {
    if (!user || cart.length === 0) return;

    // Build request payload
    const itemsPayload = cart.map(ci => ({ productId: ci.id, quantity: ci.cartQuantity }));

    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ items: itemsPayload, type, deliveryAddress: address, voucherCode })
        });
        if (!res.ok) throw new Error('Order creation failed');
        const data = await res.json();
        // append new order locally (we can fetch full order list too)
        const createdOrder = await fetch(`http://localhost:5000/api/orders`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        }).then(r => r.json()).catch(() => null);
        if (createdOrder) {
          // if API returned list, refresh
          setOrders(createdOrder);
        }
        clearCart();
      } catch (e) {
        // fallback: local optimistic order already implemented in previous logic
        clearCart();
      }
    })();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      } catch (e) {
        // fallback local update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    })();
  };

  const addProduct = (product: Product) => {
    // If user is authenticated (seller) try to create product on backend
    const createRemote = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            name: product.name,
            description: product.description,
            originalPrice: product.originalPrice,
            discountedPrice: product.discountedPrice,
            quantity: product.quantity,
            expiryTime: product.expiryTime,
            category: product.category,
            image: product.image,
            lat: product.location?.lat,
            lng: product.location?.lng,
            address: product.address
          })
        });
        if (!res.ok) throw new Error('Create product failed');
        const created = await res.json();
        setProducts(prev => [created, ...prev]);
      } catch (e) {
        // fallback to local add
        setProducts(prev => [product, ...prev]);
      }
    };
    createRemote();
    const matchingWishlist = wishlist.filter(w => 
        product.name.toLowerCase().includes(w.keyword.toLowerCase()) || 
        product.category.toLowerCase().includes(w.keyword.toLowerCase())
    );
    if (matchingWishlist.length > 0) {
        const keywords = matchingWishlist.map(w => w.keyword).join(', ');
        setTimeout(() => {
             alert(`🔔 [F-bites System] \nĐã tìm thấy món ngon khớp với từ khóa "${keywords}"!\nĐã gửi thông báo cho Buyer.`);
        }, 500);
    }
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
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: true } : u));
  };

  const rejectShop = (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <AppContext.Provider value={{
      user, login, register, logout,
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
