
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false, quantity: { gt: 0 } },
      include: { seller: { select: { shopName: true, shopAddress: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    // Map to match frontend expected structure if needed
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

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        // Fixed: body is now recognized as part of AuthRequest
        const { name, description, originalPrice, discountedPrice, image, quantity, expiryTime, category, lat, lng, address } = req.body;
        
        const product = await prisma.product.create({
            data: {
                // Fixed: Added non-null assertion as user is populated by protect middleware
                sellerId: req.user!.id,
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

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        // Fixed: params is now recognized as part of AuthRequest
        const { id } = req.params;
        const product = await prisma.product.findUnique({ where: { id } });
        
        if (!product) return res.status(404).json({ message: 'Product not found' });
        // Fixed: Added non-null assertion for user
        if (product.sellerId !== req.user!.id) return res.status(401).json({ message: 'Not authorized' });

        await prisma.product.update({
            where: { id },
            data: { isDeleted: true }
        });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, originalPrice, discountedPrice, quantity, isDeleted } = req.body; // Lấy các trường cần sửa

        // 1. Check if the dish exists and belongs to the correct owner
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
        if (product.sellerId !== req.user!.id) return res.status(403).json({ message: 'Không có quyền sửa' });

        // 2. Update
        const updated = await prisma.product.update({
            where: { id },
            data: {
                name, originalPrice, discountedPrice, quantity, isDeleted
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
