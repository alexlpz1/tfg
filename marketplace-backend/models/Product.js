// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
