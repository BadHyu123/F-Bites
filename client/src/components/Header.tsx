
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title: string;
    back?: boolean;
    rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, back, rightElement }) => {
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
