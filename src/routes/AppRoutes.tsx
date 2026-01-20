
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { MainLayout } from '../layouts/MainLayout';
<<<<<<< HEAD
import { AuthScreen } from '../pages/Auth';

// Buyer Screens
import { BuyerHome } from '../pages/buyer/Home';
import { ProductDetail } from '../pages/buyer/ProductDetail';
import { CartScreen } from '../pages/buyer/Cart';
import { MapScreen } from '../pages/buyer/Map';
import { WishlistScreen } from '../pages/buyer/Wishlist';
import { BuyerOrders } from '../pages/buyer/Orders';
import { BuyerProfile } from '../pages/buyer/Profile';
import { CheckoutScreen } from '../pages/buyer/Checkout';

// Seller Screens
import { SellerDashboard } from '../pages/seller/Dashboard';
import { SellerOrders } from '../pages/seller/Orders';
import { ProductList } from '../pages/seller/ProductList';
import { ProductForm } from '../pages/seller/ProductForm';
import { VoucherManager } from '../pages/seller/VoucherManager';
import { SellerProfile } from '../pages/seller/Profile';

// Admin Screens
import { AdminDashboard } from '../pages/admin/Dashboard';

=======

// Buyer Screens
import { BuyerHome } from '../pages/buyer/Home';
import { CartScreen } from '../pages/buyer/Cart';
import { MapScreen } from '../pages/buyer/Map';
import { BuyerProfile } from '../pages/buyer/Profile';

// Seller Screens
import { ProductList } from '../pages/seller/ProductList';
import { ProductForm } from '../pages/seller/ProductForm';
import { SellerProfile } from '../pages/seller/Profile';

>>>>>>> dev-Phuc
const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRole?: string }> = ({ children, allowedRole }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/auth" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/auth" />;
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/auth" element={<AuthScreen />} />
      
=======
    <Routes>      
>>>>>>> dev-Phuc
      {/* Public Buyer Routes (Guest Accessible) */}
      <Route path="/" element={<Navigate to="/buyer/home" />} />
      <Route path="/buyer" element={<MainLayout><Navigate to="/buyer/home" /></MainLayout>} />
      
      <Route path="/buyer/home" element={<MainLayout><BuyerHome /></MainLayout>} />
      <Route path="/buyer/map" element={<MainLayout><MapScreen /></MainLayout>} />
<<<<<<< HEAD
      <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>} />

      {/* Protected Buyer Routes */}
      <Route path="/buyer/cart" element={<ProtectedRoute allowedRole="BUYER"><MainLayout><CartScreen /></MainLayout></ProtectedRoute>} />
      <Route path="/buyer/checkout" element={<ProtectedRoute allowedRole="BUYER"><MainLayout><CheckoutScreen /></MainLayout></ProtectedRoute>} />
      <Route path="/buyer/wishlist" element={<ProtectedRoute allowedRole="BUYER"><MainLayout><WishlistScreen /></MainLayout></ProtectedRoute>} />
      <Route path="/buyer/orders" element={<ProtectedRoute allowedRole="BUYER"><MainLayout><BuyerOrders /></MainLayout></ProtectedRoute>} />
=======

      {/* Protected Buyer Routes */}
      <Route path="/buyer/cart" element={<ProtectedRoute allowedRole="BUYER"><MainLayout><CartScreen /></MainLayout></ProtectedRoute>} />
>>>>>>> dev-Phuc
      <Route path="/buyer/profile" element={<ProtectedRoute allowedRole="BUYER"><MainLayout><BuyerProfile /></MainLayout></ProtectedRoute>} />

      {/* Seller Routes */}
      <Route path="/seller" element={<MainLayout><Navigate to="/seller/dashboard" /></MainLayout>} />
<<<<<<< HEAD
      <Route path="/seller/dashboard" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><SellerDashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/orders" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><SellerOrders /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/products" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductList /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/products/new" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductForm /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/products/edit/:id" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductForm /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/vouchers" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><VoucherManager /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/profile" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><SellerProfile /></MainLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><MainLayout><AdminDashboard /></MainLayout></ProtectedRoute>} />

=======
      <Route path="/seller/products" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductList /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/products/new" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductForm /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/products/edit/:id" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductForm /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/profile" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><SellerProfile /></MainLayout></ProtectedRoute>} />

>>>>>>> dev-Phuc
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/buyer/home" />} />
    </Routes>
  );
};
