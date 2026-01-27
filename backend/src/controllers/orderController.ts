
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

// Create new orders from cart items.
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        // Fix: Cast req to any to access body and user properties on AuthRequest to resolve TS errors
        const { items, type, deliveryAddress, note } = (req as any).body;
        const buyerId = (req as any).user.id;

        // Group items by seller to create multiple orders if needed.
        const itemsBySeller: Record<string, any[]> = {};
        for (const item of items) {
            if (!itemsBySeller[item.sellerId]) itemsBySeller[item.sellerId] = [];
            itemsBySeller[item.sellerId].push(item);
        }

        const createdOrders = [];

        for (const sellerId of Object.keys(itemsBySeller)) {
            const sellerItems = itemsBySeller[sellerId];
            
            // Calculate Total.
            const subtotal = sellerItems.reduce((acc: number, item: any) => acc + (item.discountedPrice * item.cartQuantity), 0);
            const shippingFee = type === 'DELIVERY' ? 15000 : 0;
            const total = subtotal + shippingFee;

            // Transaction: Create Order, Create OrderItems, Decrement Product Quantity.
            const order = await prisma.$transaction(async (tx) => {
                const newOrder = await tx.order.create({
                    data: {
                        buyerId,
                        sellerId,
                        total,
                        shippingFee,
                        status: 'PENDING',
                        type,
                        deliveryAddress,
                        note,
                        pickupCode: type === 'PICKUP' ? `QR-${Math.floor(Math.random() * 1000000)}` : null
                    }
                });

                for (const item of sellerItems) {
                    await tx.orderItem.create({
                        data: {
                            orderId: newOrder.id,
                            productId: item.id,
                            quantity: item.cartQuantity,
                            price: item.discountedPrice
                        }
                    });

                    await tx.product.update({
                        where: { id: item.id },
                        data: { quantity: { decrement: item.cartQuantity } }
                    });
                }

                return newOrder;
            });
            createdOrders.push(order);
        }

        res.status(201).json(createdOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Create order failed' });
    }
};

// Fetch orders for current buyer or seller.
export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { buyerId: (req as any).user.id },
                    { sellerId: (req as any).user.id }
                ]
            },
            include: {
                items: { include: { product: true } },
                seller: { select: { shopName: true } },
                buyer: { select: { name: true, phone: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

// Update status of an order.
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        // Fix: Cast req to any to access params, body, and user properties on AuthRequest
        const { id } = (req as any).params;
        const { status } = (req as any).body;

        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.sellerId !== (req as any).user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        });

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order' });
    }
};
