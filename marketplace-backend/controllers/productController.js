// controllers/productController.js
import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  const products = await Product.find().populate('user', 'name');
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('user', 'name');
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const { title, description, price, image } = req.body;
  const product = new Product({ user: req.user._id, title, description, price, image });
  const created = await product.save();
  res.status(201).json(created);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  const { title, description, price, image } = req.body;
  product.title = title;
  product.description = description;
  product.price = price;
  product.image = image;
  const updated = await product.save();
  res.json(updated);
};

// controllers/productController.js

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  if (product.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
  }

  await product.deleteOne();

  res.json({ message: 'Producto eliminado' });
};

