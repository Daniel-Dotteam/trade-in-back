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

// Add this before your routes
app.get('/health', async (_req: any, res: any) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (error : any) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', error: error.message});
  }
});

// Import routes with correct paths and extensions
const routerCollection = require('./routes/collection.routes').default;
const routerProduct = require('./routes/product.routes').default;
const routerOrder = require('./routes/order.routes').default;

// Routes
app.use('/api/collections', routerCollection);
app.use('/api/products', routerProduct);
app.use('/api/orders', routerOrder);


const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

export { prisma };