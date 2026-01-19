import React, { useState, useEffect } from 'react';
import { Clock, Star, Leaf } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

const calculateTimeLeft = (expiry: string) => {
  const difference = +new Date(expiry) - +new Date();
  if (difference <= 0) return null;
  
  return {
    hours: Math.floor((difference / (1000 * 60 * 60))),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(product.expiryTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(product.expiryTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [product.expiryTime]);

  const discountPercent = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);

  return (
    <Link to={`/product/${product.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform flex flex-col h-full">
      <div className="relative h-40 w-full shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-[#FF7043] text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
          -{discountPercent}%
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
           <Star size={10} className="text-yellow-400 fill-yellow-400" /> {product.rating}
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        {/* Eco Tag */}
        <div className="mb-2 flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 w-fit px-2 py-0.5 rounded-full border border-green-100">
            <Leaf size={10} fill="currentColor" />
            <span>Giảm ~0.5kg CO2</span>
        </div>

        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-[#19454B] leading-tight line-clamp-2 text-sm h-10">{product.name}</h3>
        </div>
        <p className="text-xs text-gray-400 mb-3 truncate">{product.sellerName}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
             <div className="text-xs text-gray-400 line-through">
              {product.originalPrice.toLocaleString()} đ
            </div>
            <div className="text-[#FF7043] font-bold text-lg leading-none">
              {product.discountedPrice.toLocaleString()} đ
            </div>
          </div>
          
          {timeLeft ? (
            <div className="flex items-center gap-1 text-red-600 text-[10px] font-bold bg-red-50 px-2 py-1 rounded-lg">
              <Clock size={10} />
              <span>{String(timeLeft.hours).padStart(2,'0')}:{String(timeLeft.minutes).padStart(2,'0')}h</span>
            </div>
          ) : (
             <div className="text-gray-400 text-xs font-bold">Hết hạn</div>
          )}
        </div>
      </div>
    </Link>
  );
};