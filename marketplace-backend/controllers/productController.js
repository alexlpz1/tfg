// controllers/productController.js
import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  const products = await Product.find().populate('user','name');
  res.json(products);
};

export const getProductById = async (req, res) => {
  const p = await Product.findById(req.params.id).populate('user','name');
  if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(p);
};

export const createProduct = async (req, res) => {
  try {
    const { title, price, description, image, stock } = req.body;
    const newP = new Product({ title, price, description, image, stock, user: req.user._id });
    const saved = await newP.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// controllers/productController.js

export const updateProduct = async (req, res) => {
  try {
    const updates = {
      title:       req.body.title,
      price:       req.body.price,
      description: req.body.description,
      stock:       req.body.stock,             
    };
    if (req.file) {
      updates.image = `${req.protocol}://${req.get('host')}/api/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'No encontrado' });
  if (p.user.toString() !== req.user._id) return res.status(403).json({ message: 'Sin permiso' });
  await p.deleteOne();
  res.json({ message: 'Producto eliminado' });
};

