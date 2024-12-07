import express from 'express';
import { prisma } from '../server';
import { ProductSaleType } from '@prisma/client';

const router = express.Router();

// Create a product
router.post('/', async (req, res) => {
  try {
    const { name, price, type, productTypeId } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        price,
        type: type as ProductSaleType,
        productTypeId
      },
      include: {
        productType: {
          include: {
            collection: true
          }
        }
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
        type: type as ProductSaleType
      } : undefined,
      include: {
        productType: {
          include: {
            collection: true
          }
        }
      }
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
});

// Get products by product type
router.get('/type/:productTypeId', async (req, res) => {
  try {
    const { type } = req.query;
    const products = await prisma.product.findMany({
      where: {
        productTypeId: req.params.productTypeId,
        ...(type && { type: type as ProductSaleType })
      },
      include: {
        productType: {
          include: {
            collection: true
          }
        }
      }
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
});

export default router; 