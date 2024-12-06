import express from 'express';
import { prisma } from '../server';

const router = express.Router();

// Create an order
router.post('/', async (req, res) => {
  try {
    const { name, phoneNumber, productId } = req.body;
    const order = await prisma.order.create({
      data: {
        name,
        phoneNumber,
        productId,
      },
    });
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: 'Failed to create order' });
  }
});

export default router; 