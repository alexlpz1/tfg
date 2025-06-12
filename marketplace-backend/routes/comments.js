// routes/comments.js
import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id')
  .get(getComments)
  .post(protect, addComment);

export default router;
