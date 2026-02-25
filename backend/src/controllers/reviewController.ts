import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { productId, orderId, rating, comment } = req.body;
    if (!productId || !rating) return res.status(400).json({ message: 'Missing fields' });

    // Optionally verify that the user actually ordered the product (skipped for simplicity)

    const review = await prisma.review.create({ data: { productId, userId, orderId: orderId || null, rating: Number(rating), comment: comment || null } });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Create review failed' });
  }
};

export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({ where: { productId }, include: { user: true } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Get reviews failed' });
  }
};
