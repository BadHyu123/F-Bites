import express from 'express';

const router = express.Router();

// Minimal product routes placeholder
router.get('/', async (req, res) => {
  res.json({ message: 'Products endpoint placeholder' });
});

router.get('/:id', async (req, res) => {
  res.status(501).json({ message: 'Get product not implemented' });
});

export default router;
