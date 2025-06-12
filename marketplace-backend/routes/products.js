// src/routes/products.js
import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, createProduct);       // ← aquí
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
