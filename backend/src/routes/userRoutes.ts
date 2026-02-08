import express from 'express';

const router = express.Router();

// Minimal user routes placeholder
router.get('/profile', async (req, res) => {
  res.status(501).json({ message: 'User profile not implemented' });
});

router.put('/profile', async (req, res) => {
  res.status(501).json({ message: 'Update profile not implemented' });
});

export default router;
