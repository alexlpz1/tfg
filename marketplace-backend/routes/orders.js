// routes/orders.js
import express from 'express';
import { createOrder, getOrdersForUser } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sólo usuarios autenticados pueden crear o ver sus órdenes
router.post('/', protect, createOrder);
router.get('/',  protect, getOrdersForUser);

export default router;
