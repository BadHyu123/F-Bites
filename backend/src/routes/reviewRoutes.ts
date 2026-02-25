import express from 'express';
import { createReview, getReviewsByProduct } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/product/:productId', getReviewsByProduct);
router.post('/', protect, createReview);

export default router;
