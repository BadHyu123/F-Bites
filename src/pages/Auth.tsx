
import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { Button, Input } from '../components/UI';
import { ShoppingBag, Store, ArrowLeft, CheckCircle2, Leaf, Utensils, Globe } from 'lucide-react';

type AuthStep = 'FORM' | 'OTP';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<AuthStep>('FORM');
  const [role, setRole] = useState<Role>('BUYER');
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setError('');
    if (/^\d/.test(val)) {
        if (!/^\d*$/.test(val)) return;
        if (val.length > 10) return;
    }
    setIdentifier(val);
  };

  const detectMethod = (val: string): 'PHONE' | 'EMAIL' => {
    if (/^\d+$/.test(val)) return 'PHONE';
    return 'EMAIL';
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const method = detectMethod(identifier);

    if (method === 'PHONE') {
        if (identifier.length !== 10) {
            setError('Số điện thoại phải bao gồm đúng 10 chữ số.');
            return;
        }
        if (!identifier.startsWith('0')) {
             setError('Số điện thoại không hợp lệ (phải bắt đầu bằng số 0).');
             return;
        }
    }

    if (isLogin) {
      if (identifier === 'admin@test.com') {
          login(identifier, method, 'ADMIN');
          navigate('/admin');
          return;
      }

      login(identifier, method, 'BUYER');
      navigate('/buyer/home'); 
    } else {
      if (password !== confirmPassword) {
        setError('Mật khẩu nhập lại không khớp');
        return;
      }
      if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }
      setStep('OTP');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Mã OTP phải có 6 chữ số');
      return;
    }
    const method = detectMethod(identifier);
    login(identifier, method, role);
    
    if (role === 'BUYER') navigate('/buyer/home');
    else if (role === 'SELLER') navigate('/seller/dashboard');
    else navigate('/admin');
  };

  const switchMode = (mode: boolean) => {
    setIsLogin(mode);
    setStep('FORM');
    setError('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-[#19454B] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Leaf className="absolute top-10 left-10 w-24 h-24 rotate-45" />
          <Globe className="absolute bottom-20 right-10 w-32 h-32 -rotate-12" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-sm z-10">
        <div className="mb-8 text-center flex flex-col items-center">
            <div className="flex items-center justify-center mb-2">
                <div className="relative mr-1">
                    <span className="text-6xl font-black text-[#FF6B35] tracking-tighter leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>F</span>
                    <Utensils className="absolute top-1/2 -right-3 -translate-y-1/2 text-white opacity-80 rotate-90" size={20} />
                </div>
                <div className="flex items-center">
                    <span className="text-5xl font-bold text-white tracking-tight ml-2">Bites</span>
                    <Leaf className="text-green-400 mb-6 -ml-1 drop-shadow-lg" size={24} fill="currentColor" />
                </div>
            </div>
            
          <p className="text-teal-100 font-medium text-sm max-w-[200px] leading-relaxed">
            Chung tay giải cứu thực phẩm, bảo vệ hành tinh xanh 🌍
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {step === 'FORM' && (
            <div className="animate-in fade-in slide-in-from-right duration-300">
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button 
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-[#19454B] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => switchMode(true)}
                >
                  Đăng nhập
                </button>
                <button 
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-[#19454B] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => switchMode(false)}
                >
                  Đăng ký
                </button>
              </div>

              {!isLogin && (
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-800 mb-2">Bạn là ai?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setRole('BUYER')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${role === 'BUYER' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      <ShoppingBag size={20} />
                      <span className="font-bold text-sm">Người giải cứu</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('SELLER')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${role === 'SELLER' ? 'border-[#19454B] bg-teal-50 text-[#19454B]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      <Store size={20} />
                      <span className="font-bold text-sm">Nhà bán hàng</span>
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <Input 
                  label="Tài khoản"
                  type="text"
                  placeholder="Email hoặc SĐT (10 số)"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  required
                />

                <Input 
                  label="Mật khẩu"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {!isLogin && (
                   <Input 
                    label="Xác nhận mật khẩu"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                )}

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-bold border border-red-100 flex items-start gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
                
                <Button fullWidth type="submit" variant="primary" className="mt-2 text-base shadow-lg shadow-teal-900/20">
                  {isLogin ? 'Đăng nhập' : 'Tham gia ngay'}
                </Button>
                
                <Button fullWidth type="button" variant="outline" className="mt-1" onClick={() => navigate('/buyer/home')}>
                  Xem trang chủ (Khách)
                </Button>
              </form>
            </div>
          )}

          {step === 'OTP' && (
            <div className="animate-in fade-in slide-in-from-right duration-300 text-center">
              <div className="mb-6">
                 <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#19454B]">
                    <CheckCircle2 size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">Xác thực tài khoản</h2>
                 <p className="text-sm text-gray-500 mt-2">
                    Mã xác thực 6 số đã được gửi đến <br/>
                    <span className="font-bold text-gray-800">
                      {detectMethod(identifier) === 'EMAIL' ? 'Email' : 'Zalo'}: {identifier}
                    </span>
                 </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                    <input 
                        type="text" 
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setOtp(val);
                            setError('');
                        }}
                        className="w-full text-center text-3xl tracking-[0.5em] font-bold py-4 border-b-2 border-gray-300 focus:border-[#19454B] focus:outline-none bg-transparent"
                        placeholder="••••••"
                        autoFocus
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

                <Button fullWidth type="submit" variant="primary" className="shadow-lg shadow-teal-900/20">
                    Xác nhận & Hoàn tất
                </Button>

                <button 
                    type="button" 
                    onClick={() => setStep('FORM')}
                    className="flex items-center justify-center gap-1 text-sm text-gray-500 font-medium hover:text-[#19454B] w-full py-2"
                >
                    <ArrowLeft size={16} /> Quay lại
                </button>
              </form>
            </div>
          )}
        </div>

        {isLogin && step === 'FORM' && (
           <div className="mt-6 text-center">
               <p className="text-xs text-teal-200/70 mb-2">Tài khoản dùng thử:</p>
               <div className="flex gap-2 justify-center text-xs flex-wrap">
                  <button 
                    onClick={() => { setIdentifier('buyer@test.com'); setPassword('123456'); }} 
                    className="bg-white/10 px-3 py-1 rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                    Buyer
                  </button>
                  <button 
                    onClick={() => { setIdentifier('seller@test.com'); setPassword('123456'); }} 
                    className="bg-white/10 px-3 py-1 rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                    Seller
                  </button>
                   <button 
                    onClick={() => { setIdentifier('admin@test.com'); setPassword('123456'); }} 
                    className="bg-white/10 px-3 py-1 rounded-full text-white hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Admin
                  </button>
               </div>
           </div>
        )}
      </div>
    </div>
  );
};
