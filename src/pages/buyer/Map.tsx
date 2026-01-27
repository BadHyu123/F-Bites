import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { MapPin, Navigation, ArrowRight, Store, Clock, Star } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';

// Helper component to center map when location changes
const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

// Custom Marker Icons
const createCustomIcon = (price: number, isSelected: boolean) => {
  const colorClass = isSelected ? 'bg-[#FF7043] scale-110 z-50' : 'bg-[#19454B]';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="${colorClass} text-white font-bold text-[10px] px-2 py-1 rounded-full shadow-lg border-2 border-white transform transition-all text-center whitespace-nowrap w-fit flex flex-col items-center">
        <span>${(price / 1000).toFixed(0)}k</span>
        <div class="w-2 h-2 ${colorClass} rotate-45 -mt-1 translate-y-1/2"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 35],
    popupAnchor: [0, -35]
  });
};

const userIcon = L.divIcon({
  className: 'user-marker',
  html: `
    <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md relative">
        <div class="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping"></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const MapScreen: React.FC = () => {
  const { userLocation, products } = useApp();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter out deleted products or 0 quantity
  const validProducts = products.filter(p => !p.isDeleted && p.quantity > 0);

  // Default coords if userLocation is missing lat/lng (fallback to D1 HCMC)
  const centerLat = userLocation.lat || 10.7756;
  const centerLng = userLocation.lng || 106.7020;

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
      <div className="z-50">
          <Header title="Bản đồ Món ngon" />
      </div>

      <div className="flex-1 relative w-full h-full z-0">
         {/* Map Container */}
         <MapContainer 
            center={[centerLat, centerLng]} 
            zoom={15} 
            scrollWheelZoom={true} 
            className="w-full h-full"
            zoomControl={false}
         >
            {/* Tile Layer (CartoDB Voyager - Clean Look) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <RecenterAutomatically lat={centerLat} lng={centerLng} />

            {/* User Location Marker */}
            <Marker position={[centerLat, centerLng]} icon={userIcon} />

            {/* Product Markers */}
            {validProducts.map(product => (
              <Marker
                key={product.id}
                position={[product.location.lat, product.location.lng]}
                icon={createCustomIcon(product.discountedPrice, selectedProduct?.id === product.id)}
                eventHandlers={{
                  click: () => setSelectedProduct(product),
                }}
              />
            ))}
         </MapContainer>
         
         {/* Top Overlay Controls */}
         <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-gray-100 pointer-events-auto flex items-center gap-2 max-w-[70%]">
                <MapPin size={16} className="text-[#FF7043] shrink-0" />
                <span className="text-xs font-bold text-[#19454B] truncate">{userLocation.addressDisplay}</span>
            </div>
         </div>

         {/* Bottom Product Detail Card (Overlay) */}
         {selectedProduct && (
             <div className="absolute bottom-24 left-4 right-4 z-[400] animate-in slide-in-from-bottom duration-300">
                 <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 flex gap-3 relative overflow-hidden" onClick={() => navigate(`/product/${selectedProduct.id}`)}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(null); }}
                        className="absolute top-2 right-2 bg-gray-100 rounded-full p-1 text-gray-400 hover:text-gray-600 z-10"
                    >
                        <ArrowRight size={16} className="rotate-90" />
                    </button>

                     <div className="w-24 h-24 rounded-xl shrink-0 bg-gray-100 relative">
                         <img src={selectedProduct.image} className="w-full h-full object-cover rounded-xl" alt={selectedProduct.name} />
                         <div className="absolute top-1 left-1 bg-[#FF7043] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            -{Math.round(((selectedProduct.originalPrice - selectedProduct.discountedPrice) / selectedProduct.originalPrice) * 100)}%
                         </div>
                     </div>
                     
                     <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                             <Store size={12} /> <span className="truncate">{selectedProduct.sellerName}</span>
                         </div>
                         <h3 className="font-bold text-[#19454B] text-sm leading-tight line-clamp-2 mb-1">
                             {selectedProduct.name}
                         </h3>
                         
                         <div className="flex items-center gap-2 mb-2">
                             <span className="font-bold text-[#FF7043] text-lg">{selectedProduct.discountedPrice.toLocaleString()}đ</span>
                             <span className="text-xs text-gray-400 line-through decoration-1">{selectedProduct.originalPrice.toLocaleString()}đ</span>
                         </div>

                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[10px] bg-red-50 text-red-500 px-2 py-1 rounded-lg font-bold border border-red-100">
                                <Clock size={12} /> Hết hạn: {new Date(selectedProduct.expiryTime).getHours()}h{new Date(selectedProduct.expiryTime).getMinutes().toString().padStart(2,'0')}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                <Star size={10} className="fill-yellow-400 text-yellow-400" /> {selectedProduct.rating}
                            </div>
                         </div>
                     </div>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};