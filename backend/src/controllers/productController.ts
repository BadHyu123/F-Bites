
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

// Get list of active products.
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false, quantity: { gt: 0 } },
      include: { seller: { select: { shopName: true, shopAddress: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    // Map to match frontend expected structure.
    const formatted = products.map(p => ({
        ...p,
        sellerName: p.seller.shopName,
        location: { lat: p.lat, lng: p.lng }
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product.
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        // Fix: Cast req to any to access body property on AuthRequest and avoid TypeScript errors
        const { name, description, originalPrice, discountedPrice, image, quantity, expiryTime, category, lat, lng, address } = (req as any).body;
        
        const product = await prisma.product.create({
            data: {
                // Fix: Cast req to any to access user.id
                sellerId: (req as any).user.id,
                name,
                description,
                originalPrice,
                discountedPrice,
                image,
                quantity,
                expiryTime: new Date(expiryTime),
                category,
                lat,
                lng,
                address
            }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Soft delete a product.
export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        // Fix: Cast req to any to access params and user properties on AuthRequest
        const { id } = (req as any).params;
        const product = await prisma.product.findUnique({ where: { id } });
        
        if (!product) return res.status(404).json({ message: 'Product not found' });
        // Fix: Cast req to any for user validation
        if (product.sellerId !== (req as any).user.id) return res.status(401).json({ message: 'Not authorized' });

        await prisma.product.update({
            where: { id },
            data: { isDeleted: true }
        });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
