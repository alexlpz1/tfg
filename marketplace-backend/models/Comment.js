// models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
