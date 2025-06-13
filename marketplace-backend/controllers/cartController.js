// controllers/cartController.js
import CartItem from '../models/CartItem.js';

export const getCart = async (req, res) => {
  const items = await CartItem.find({ user: req.user._id }).populate('product');
  res.json(items);
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let item = await CartItem.findOne({ user: req.user._id, product: productId });
  if (item) {
    item.quantity += quantity;
  } else {
    item = new CartItem({ user: req.user._id, product: productId, quantity });
  }
  const saved = await item.save();
  res.json(saved);
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const item = await CartItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item no encontrado' });
  item.quantity = quantity;
  const updated = await item.save();
  res.json(updated);
};

export const removeCartItem = async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item eliminado' });
};

export const clearCart = async (req, res) => {
  await CartItem.deleteMany({ user: req.user._id });
  res.status(204).send();
};