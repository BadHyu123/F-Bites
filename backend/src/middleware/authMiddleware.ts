import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Using type intersection to ensure all Express Request properties (body, params, headers) are preserved
export type AuthRequest = Request & {
  user?: {
    id: string;
    role: string;
  };
};

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fbites_secret_key_2025') as any;
      
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      
      next();
      return;
    } catch (error) {
      res.status(401).json({ message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện thao tác này' });
  }
};

// Middleware kiểm tra quyền Seller
export const sellerOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'SELLER' || req.user.role === 'ADMIN')) {
        next();
    } else {
        res.status(403).json({ message: 'Quyền truy cập dành riêng cho Nhà bán hàng' });
    }
};

// Middleware kiểm tra quyền Admin
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Yêu cầu quyền Quản trị viên' });
    }
};