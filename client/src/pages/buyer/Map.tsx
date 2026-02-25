import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // <--- Đừng quên dòng này!
import { Search, Navigation, X, Clock, Leaf, Star } from "lucide-react";
import { useApp } from '../../hooks/useApp';

// --- 1. CẤU HÌNH ICON MARKER ---
const createRescueIcon = (emoji: string) =>
  L.divIcon({
    html: `<div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-[3px] border-[#FF5722] transform -translate-x-1/2 -translate-y-1/2 text-xl relative">
            ${emoji}
            <div class="absolute -bottom-1 w-2 h-2 bg-[#FF5722] rotate-45"></div>
         </div>`,
    className: "custom-rescue-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 24],
  });

// --- 2. DỮ LIỆU (ĐÀ NẴNG) ---
const LOCATIONS = [
  {
    id: 1,
    lat: 16.0605,
    lng: 108.2205,
    emoji: "🍜",
    name: "Mì Quảng Bà Mua",
    address: "19 Trần Bình Trọng, Hải Châu",
    rating: 4.5,
    distance: "0.5 km",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=60&w=200",
  },
  {
    id: 2,
    lat: 16.068,
    lng: 108.223,
    emoji: "🥖",
    name: "Bánh Mì Phượng",
    address: "Chợ Hàn, Bạch Đằng",
    rating: 4.8,
    distance: "1.2 km",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=60&w=200",
  },
  {
    id: 3,
    lat: 16.055,
    lng: 108.234,
    emoji: "🥐",
    name: "BonPas Bakery",
    address: "112 Võ Văn Kiệt, Sơn Trà",
    rating: 4.6,
    distance: "2.0 km",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=60&w=200",
  },
];

// Component xử lý click
const MapEvents = ({ onMapClick }: { onMapClick: () => void }) => {
  useMapEvents({
    click: () => onMapClick(),
  });
  return null;
};

// --- COMPONENT CHÍNH ---
export const MapScreen: React.FC = () => {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const { products } = useApp();

  // derive unique shops from products
  const shops = React.useMemo(() => {
    const map: Record<string, any> = {};
    (products || []).forEach((p: any) => {
      if (p.sellerId && !map[p.sellerId]) {
        map[p.sellerId] = {
          id: p.sellerId,
          lat: p.lat || p.location?.lat,
          lng: p.lng || p.location?.lng,
          emoji: '🍽️',
          name: p.sellerName || p.seller?.name || 'Shop',
          address: p.address || p.seller?.shopAddress || '',
          rating: p.rating || 4.5,
          image: p.image
        };
      }
    });
    return Object.values(map);
  }, [products]);

  return (
    <div className="w-full h-full relative bg-gray-100 flex flex-col">
      {/* HEADER TÌM KIẾM */}
      <div className="absolute top-0 left-0 w-full p-4 pt-10 z-[400] pointer-events-none">
        <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 mb-3 pointer-events-auto">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Tìm món ngon tại Đà Nẵng..."
            className="flex-1 outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-2">
          {["Tất cả", "Bánh ngọt", "Mì Quảng", "Hải sản"].map((item, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-md border ${index === 0 ? "bg-[#15383D] text-white" : "bg-white text-gray-700"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* BẢN ĐỒ */}
      <MapContainer
        center={[16.06, 108.22]} // Cầu Rồng, Đà Nẵng
        zoom={14}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap"
        />
        <MapEvents onMapClick={() => setSelectedShop(null)} />

        {shops.map((loc: any) => (
          <Marker
            key={loc.id}
            position={[loc.lat || 10.7769, loc.lng || 106.7009]}
            icon={createRescueIcon(loc.emoji)}
            eventHandlers={{ click: () => setSelectedShop(loc) }}
          />
        ))}

        <Marker
          position={[16.061, 108.221]}
          icon={L.divIcon({
            html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>`,
            className: "current-location",
            iconSize: [16, 16],
          })}
        />
      </MapContainer>

      {/* POPUP CHI TIẾT */}
      {selectedShop && (
        <div className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl z-[500] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex gap-3 mb-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <img
                src={selectedShop.image}
                className="w-full h-full object-cover"
                alt={selectedShop.name}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-extrabold text-gray-900 truncate">
                  {selectedShop.name}
                </h3>
                <button onClick={() => setSelectedShop(null)}>
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-500 truncate mb-1">
                {selectedShop.address}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="flex items-center gap-0.5 text-yellow-500">
                  <Star size={10} fill="currentColor" /> {selectedShop.rating}
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-0.5 text-gray-500">
                  <Navigation size={10} /> {selectedShop.distance}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold">
              Chỉ đường
            </button>
            <button className="flex-1 bg-[#15383D] text-white py-2.5 rounded-xl text-xs font-bold">
              Xem chi tiết
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
