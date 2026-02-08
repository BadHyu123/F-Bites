import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:orderId/status', updateOrderStatus);

export default router;
