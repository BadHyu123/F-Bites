
import express from 'express';
import { approveShop, getPendingShops, rejectShop, getAdminStats, getDailyRevenue } from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

// Tất cả route dưới đây đều yêu cầu Login + Quyền Admin
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/revenue/daily', getDailyRevenue);
router.get('/pending-shops', getPendingShops);
router.put('/approve/:userId', approveShop);
router.delete('/reject/:userId', rejectShop);

export default router;
