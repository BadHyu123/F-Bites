
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import reviewRoutes from './routes/reviewRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);   // New: Profile updates
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);  // New: Admin operations
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('F-bites API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
