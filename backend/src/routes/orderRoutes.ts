
import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, sellerOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.put('/:id/status', protect, sellerOnly, updateOrderStatus);

export default router;
