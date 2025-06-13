// backend/routes/products.js
import express from 'express';
import {
  getProducts, getProductById,
  createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({ dest: path.join(__dirname,'../uploads/') });

router.get('/',     getProducts);
router.get('/:id',  getProductById);
router.post('/',    protect, createProduct);
router.put('/:id',  protect, upload.single('file'), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
