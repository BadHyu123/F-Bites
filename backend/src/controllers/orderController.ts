import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) return res.status(401).json({ message: 'Unauthorized' });

    const { items, type, deliveryAddress } = req.body; // items: [{ productId, quantity }]
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });

    // For simplicity group by sellerId of products
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    // Assume all items belong to same seller for this simplified create
    const sellerId = products[0].sellerId;
    let total = 0;
    const createdOrder = await prisma.order.create({
      data: {
        buyerId,
        sellerId,
        total: 0,
        shippingFee: type === 'DELIVERY' ? 15000 : 0,
        status: 'PENDING',
        type,
        deliveryAddress: deliveryAddress || null,
        items: {
          create: items.map((it: any) => {
            const p = products.find(pr => pr.id === it.productId);
            const price = p ? p.discountedPrice : 0;
            total += price * Number(it.quantity || 0);
            return { productId: it.productId, quantity: Number(it.quantity || 0), price };
          })
        }
      },
      include: { items: true }
    });

    // update order total
    await prisma.order.update({ where: { id: createdOrder.id }, data: { total: total + (type === 'DELIVERY' ? 15000 : 0) } });

    // Decrement product quantities (best-effort)
    for (const it of items) {
      await prisma.product.updateMany({ where: { id: it.productId }, data: { quantity: { decrement: Number(it.quantity) } } });
    }

    res.json({ message: 'Order created', orderId: createdOrder.id });
  } catch (error) {
    res.status(500).json({ message: 'Tạo đơn hàng thất bại' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let orders;
    if (role === 'SELLER') {
      orders = await prisma.order.findMany({ where: { sellerId: userId }, include: { items: true } });
    } else {
      orders = await prisma.order.findMany({ where: { buyerId: userId }, include: { items: true } });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lấy đơn hàng thất bại' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updated = await prisma.order.update({ where: { id: orderId }, data: { status } });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật trạng thái thất bại' });
  }
};
