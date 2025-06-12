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
  try {
    const imgPath = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : null;
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: imgPath,
      user: req.userId
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
    };
    if (req.file) {
      updates.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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

