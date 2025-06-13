import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  price:       { type: Number, required: true },
  description: { type: String, required: true },
  image:       { type: String, required: true },
  stock:       { type: Number, required: true, default: 1 },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
