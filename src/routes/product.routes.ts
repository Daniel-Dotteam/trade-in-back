import express from 'express';
import { prisma } from '../server';

const router = express.Router();

// Create a product
router.post('/', async (req, res) => {
  try {
    const { name, price, type, collectionId } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        price,
        type,
        collectionId
      }
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const products = await prisma.product.findMany({
      where: type ? {
        type: type as 'FOR_SALE' | 'FOR_TRADE'
      } : undefined,
      include: {
        collection: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        collection: true
      }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, type, collectionId } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        price,
        type,
        collectionId
      }
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

export default router; 