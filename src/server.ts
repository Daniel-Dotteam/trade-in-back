require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const allowedCors = "*";

var corsOptions = {
    origin: '*',
    credentials: true,
};

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', async (_req: any, res: any) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Import routes
import collectionRoutes from './routes/collection.routes';
import productTypeRoutes from './routes/productType.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

// Use routes
app.use('/api/collections', collectionRoutes);
app.use('/api/product-types', productTypeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

export { prisma };