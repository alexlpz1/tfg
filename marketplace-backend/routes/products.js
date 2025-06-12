// src/routes/products.js
import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, createProduct);       // ← aquí
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
