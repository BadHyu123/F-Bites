
import express from 'express';
import { getProducts, createProduct, deleteProduct } from '../controllers/productController';
import { protect, sellerOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, sellerOnly, createProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);

export default router;
