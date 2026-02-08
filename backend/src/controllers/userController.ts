import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, phone: true, role: true, shopName: true, shopAddress: true } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lấy profile thất bại' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, phone, shopName, shopAddress } = req.body;
    const updated = await prisma.user.update({ where: { id: userId }, data: { name, phone, shopName, shopAddress } });
    res.json({ id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật profile thất bại' });
  }
};
