
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Fix: Explicitly extend Request from express to avoid conflict with global Request type and ensure generic parameters are handled
export interface AuthRequest extends Request<any, any, any, any> {
  user?: any;
}

// Middleware to protect routes by verifying the JWT token in the Authorization header.
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Fix: Cast to any to ensure properties like headers are accessible without TypeScript errors
  const authReq = req as any;

  if (authReq.headers && authReq.headers.authorization && authReq.headers.authorization.startsWith('Bearer')) {
    try {
      token = authReq.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      authReq.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to restrict access to sellers or admins only.
export const sellerOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Fix: Use any casting to avoid property access errors
    const authReq = req as any;
    if (authReq.user && (authReq.user.role === 'SELLER' || authReq.user.role === 'ADMIN')) {
        next();
    } else {
        res.status(403).json({ message: 'Require Seller role' });
    }
};
