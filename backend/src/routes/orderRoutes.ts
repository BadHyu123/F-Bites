import express from 'express';

const router = express.Router();

// Minimal order routes placeholder
router.get('/', async (req, res) => {
  res.json({ message: 'Orders endpoint placeholder' });
});

router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Create order not implemented' });
});

export default router;
