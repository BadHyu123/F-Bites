
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { MainLayout } from '../layouts/MainLayout';

// Buyer Screens
import { BuyerHome } from '../pages/buyer/Home';
import { CartScreen } from '../pages/buyer/Cart';
import { MapScreen } from '../pages/buyer/Map';
import { BuyerProfile } from '../pages/buyer/Profile';

// Seller Screens
import { ProductList } from '../pages/seller/ProductList';
import { ProductForm } from '../pages/seller/ProductForm';
import { SellerProfile } from '../pages/seller/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRole?: string }> = ({ children, allowedRole }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/auth" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/auth" />;
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>      
      {/* Public Buyer Routes (Guest Accessible) */}
      <Route path="/" element={<Navigate to="/buyer/home" />} />
      <Route path="/buyer" element={<MainLayout><Navigate to="/buyer/home" /></MainLayout>} />
      
      <Route path="/buyer/home" element={<MainLayout><BuyerHome /></MainLayout>} />
      <Route path="/buyer/map" element={<MainLayout><MapScreen /></MainLayout>} />

      {/* Protected Buyer Routes */}
      <Route path="/buyer/cart" element={<ProtectedRoute allowedRole="BUYER"><MainLayout><CartScreen /></MainLayout></ProtectedRoute>} />
      <Route path="/buyer/profile" element={<ProtectedRoute allowedRole="BUYER"><MainLayout><BuyerProfile /></MainLayout></ProtectedRoute>} />

      {/* Seller Routes */}
      <Route path="/seller" element={<MainLayout><Navigate to="/seller/dashboard" /></MainLayout>} />
      <Route path="/seller/products" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductList /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/products/new" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductForm /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/products/edit/:id" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><ProductForm /></MainLayout></ProtectedRoute>} />
      <Route path="/seller/profile" element={<ProtectedRoute allowedRole="SELLER"><MainLayout><SellerProfile /></MainLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/buyer/home" />} />
    </Routes>
  );
};
