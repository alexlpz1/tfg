// routes/cart.js
import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',    protect, getCart);
router.post('/',   protect, addToCart);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeCartItem);

// esta es la ruta que faltaba:
router.delete('/', protect, clearCart);

export default router;
  