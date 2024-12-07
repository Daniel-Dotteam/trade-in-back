import express from 'express';
import { prisma } from '../server';

const router = express.Router();

// Get all product types
router.get('/', async (req, res) => {
  try {
    const productTypes = await prisma.productType.findMany({
      include: {
        collection: true,
        products: true
      }
    });
    res.json(productTypes);
  } catch (error: any) {
    console.error('Error in GET /product-types:', error);
    res.status(500).json({ error: 'Failed to fetch product types', details: error.message });
  }
});

// Create a product type
router.post('/', async (req, res) => {
  try {
    const { name, collectionId } = req.body;
    const productType = await prisma.productType.create({
      data: {
        name,
        collectionId
      },
      include: {
        collection: true,
        products: true
      }
    });
    res.json(productType);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product type' });
  }
});

// Get product types by collection
router.get('/collection/:collectionId', async (req, res) => {
  try {
    console.log('Fetching product types for collection:', req.params.collectionId);
    
    const productTypes = await prisma.productType.findMany({
      where: {
        collectionId: req.params.collectionId
      },
      include: {
        products: {
          where: {
            type: 'FOR_TRADE'
          }
        }
      }
    });
    
    console.log('Found product types:', productTypes);
    res.json(productTypes);
  } catch (error: any) {
    console.error('Error in GET /product-types/collection/:id:', error);
    res.status(500).json({ error: 'Failed to fetch product types', details: error.message });
  }
});

export default router; 