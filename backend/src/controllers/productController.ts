import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, originalPrice, discountedPrice, quantity, expiryTime, category, image, lat, lng, address } = req.body;
    const sellerId = req.user?.id;
    if (!sellerId) return res.status(401).json({ message: 'Unauthorized' });

    const product = await prisma.product.create({
      data: {
        sellerId,
        name,
        description,
        originalPrice: Number(originalPrice || 0),
        discountedPrice: Number(discountedPrice || 0),
        quantity: Number(quantity || 0),
        expiryTime: new Date(expiryTime),
        category,
        image,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        address
      }
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Tạo sản phẩm thất bại' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { sellerId, category } = req.query;
    const where: any = { isDeleted: false };
    if (sellerId) where.sellerId = String(sellerId);
    if (category) where.category = String(category);

    const products = await prisma.product.findMany({ where });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lấy danh sách sản phẩm thất bại' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lấy sản phẩm thất bại' });
  }
};
