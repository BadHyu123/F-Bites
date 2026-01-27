
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy danh sách các Shop đang chờ duyệt (Pending)
export const getPendingShops = async (req: Request, res: Response) => {
    try {
        const shops = await prisma.user.findMany({
            where: {
                role: 'SELLER',
                isApproved: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                shopName: true,
                shopAddress: true,
                createdAt: true
            }
        });
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Duyệt Shop
export const approveShop = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        const shop = await prisma.user.findUnique({ where: { id: userId } });
        if (!shop || shop.role !== 'SELLER') {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const updatedShop = await prisma.user.update({
            where: { id: userId },
            data: { isApproved: true }
        });

        res.json({ message: `Shop ${updatedShop.shopName} has been approved`, shop: updatedShop });
    } catch (error) {
        res.status(500).json({ message: 'Approval failed' });
    }
};

// Từ chối/Xóa Shop
export const rejectShop = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        await prisma.user.delete({ where: { id: userId } });
        res.json({ message: 'Shop rejected and removed' });
    } catch (error) {
        res.status(500).json({ message: 'Reject failed' });
    }
};

// Thống kê Dashboard
export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalRevenueResult = await prisma.order.aggregate({
            _sum: { total: true }
        });
        const totalOrders = await prisma.order.count();
        const totalUsers = await prisma.user.count();

        res.json({
            revenue: totalRevenueResult._sum.total || 0,
            orders: totalOrders,
            users: totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Stats error' });
    }
};
