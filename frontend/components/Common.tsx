import React, { ButtonHTMLAttributes, InputHTMLAttributes, useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', fullWidth, className = '', ...props 
}) => {
  const base = "px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center";
  const variants = {
    // Primary: Brand Teal #19454B
    primary: "bg-[#19454B] text-white hover:bg-[#13353a] shadow-md shadow-teal-900/10",
    // Secondary: Accent Orange #FF7043
    secondary: "bg-[#FF7043] text-white hover:bg-[#e64a19] shadow-md shadow-orange-500/20",
    // Outline: White bg, Teal Border
    outline: "bg-white border-2 border-[#19454B] text-[#19454B] hover:bg-teal-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-bold text-[#19454B]">{label}</label>}
      <div className="relative">
        <input 
          type={inputType}
          className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#19454B] focus:border-[#19454B] focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${className} ${isPassword ? 'pr-12' : ''}`}
          {...props}
        />
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#19454B] p-1 rounded-full transition-colors"
            tabIndex={-1} // Prevent tabbing to this button while filling form
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-600 font-semibold">{error}</span>}
    </div>
  );
};

// Header - Reskinned to Solid Brand Color
export const Header: React.FC<{ title: string, back?: boolean, rightElement?: React.ReactNode }> = ({ title, back, rightElement }) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-50 bg-[#19454B] border-b border-[#19454B] px-4 py-3 flex items-center justify-between shadow-md h-14">
      <div className="flex items-center gap-3">
        {back && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-lg font-bold text-white truncate">{title}</h1>
      </div>
      {rightElement && <div className="text-white">{rightElement}</div>}
    </div>
  );
};

// Badge
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PREPARING: 'bg-blue-100 text-blue-800',
    READY: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    PICKUP: 'bg-teal-100 text-teal-800', // Changed to match theme
    DELIVERY: 'bg-orange-100 text-orange-800',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};