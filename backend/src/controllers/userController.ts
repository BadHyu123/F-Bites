
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

// Lấy thông tin Profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                avatar: true,
                shopName: true,
                shopAddress: true,
                isApproved: true
            }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Cập nhật thông tin Profile (Dùng chung cho Buyer & Seller)
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, phone, avatar, shopName, shopAddress } = req.body;
        const userId = req.user!.id;

        // Chỉ cho phép update shopName/Address nếu là Seller
        const updateData: any = { name, phone, avatar };
        
        if (req.user!.role === 'SELLER') {
            if (shopName) updateData.shopName = shopName;
            if (shopAddress) updateData.shopAddress = shopAddress;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                avatar: true,
                shopName: true,
                shopAddress: true,
                isApproved: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};
