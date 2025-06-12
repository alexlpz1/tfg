import express from 'express';
import { createOrder, getUserOrders, getUserSales } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tus órdenes (lo que tú compraste)
router.get('/',  protect, getUserOrders);
// Tus ventas (lo que otros compraron de ti)
router.get('/sales', protect, getUserSales);

// Crear una orden
router.post('/', protect, createOrder);

export default router;
