import express from 'express';
import { getProducts, getProduct, createProduct } from '../controllers/productController';
import { protect, sellerOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, sellerOnly, createProduct);

export default router;
