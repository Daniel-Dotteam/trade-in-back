import express from 'express';
import { prisma } from '../server';

const router = express.Router();

// Create an order
router.post('/', async (req, res) => {
  try {
    const { name, phoneNumber, saleProductId, tradeProductId } = req.body;
    
    // Validate required fields
    if (!name || !phoneNumber || !saleProductId || !tradeProductId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, phone number, sale product ID, and trade product ID are required'
      });
    }

    const order = await prisma.order.create({
      data: {
        customerName: name,
        customerPhone: phoneNumber,
        saleProductId: saleProductId,    // Product they want to buy
        tradeProductId: tradeProductId,  // Product they want to trade in
        date: new Date(),
        status: 'PENDING'
      },
      include: {
        Product_Order_saleProductIdToProduct: true,    // Include sale product details
        Product_Order_tradeProductIdToProduct: true,   // Include trade product details
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ 
      error: 'Failed to create order', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        Product_Order_saleProductIdToProduct: true,
        Product_Order_tradeProductIdToProduct: true,
      },
      orderBy: {
        date: 'desc'
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(400).json({ 
      error: 'Failed to fetch orders',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        Product_Order_saleProductIdToProduct: true,
        Product_Order_tradeProductIdToProduct: true,
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(400).json({ 
      error: 'Failed to fetch order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['PENDING', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        Product_Order_saleProductIdToProduct: true,
        Product_Order_tradeProductIdToProduct: true,
      }
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ 
      error: 'Failed to update order status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 