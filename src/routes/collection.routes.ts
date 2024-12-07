import express from 'express';
import { prisma } from '../server';
import { ProductSaleType } from '@prisma/client';

const router = express.Router();

// Create a collection
router.post('/', async (req, res) => {
  try {
    const { name, productSaleTypes } = req.body;
    const collection = await prisma.collection.create({
      data: { 
        name,
        productSaleTypes: productSaleTypes || []
      },
      include: {
        productTypes: {
          include: {
            products: true
          }
        }
      }
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
        productTypes: {
          include: {
            products: true
          }
        }
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
        productTypes: {
          include: {
            products: true
          }
        }
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

export default router; 