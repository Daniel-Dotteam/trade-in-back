import express from 'express';
import { prisma } from '../server';

const router = express.Router();

// Create a collection
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const collection = await prisma.collection.create({
      data: { name }
    });
    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create collection' });
  }
});

// Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        products: true
      }
    });
    res.json(collections);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch collections' });
  }
});

// Get collection by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: req.params.id },
      include: {
        products: true
      }
    });
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch collection' });
  }
});

// Update collection
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const collection = await prisma.collection.update({
      where: { id: req.params.id },
      data: { name }
    });
    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update collection' });
  }
});

// Delete collection
router.delete('/:id', async (req, res) => {
  try {
    await prisma.collection.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete collection' });
  }
});

// Add this new endpoint to get products by collection ID and type
router.get('/:id/products', async (req, res) => {
  try {
    const { type } = req.query;
    const products = await prisma.product.findMany({
      where: {
        collectionId: req.params.id,
        type: type as 'FOR_SALE' | 'FOR_TRADE'
      }
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products for collection' });
  }
});

export default router; 