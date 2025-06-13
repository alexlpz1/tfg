import Order from '../models/Order.js';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shipping, total } = req.body;
    for (const item of items) {
      const prod = await Product.findById(item.product);
      if (!prod) {
        return res.status(404).json({ message: `Producto ${item.product} no encontrado` });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${prod.title}` });
      }
      prod.stock -= item.quantity;
      await prod.save();
    }
    const order = new Order({
      user: req.user._id,
      items,
      shipping,
      total
    });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('❌ Error creando orden:', err);
    res.status(400).json({ message: err.message });
  }
};

// Tus compras
export const getUserOrders = async (req, res) => {
  const orders = await Order
    .find({ user: req.user._id })
    .populate('items.product', 'title price image')
    .populate('user', 'name email');
  res.json(orders);
};

// Tus ventas
export const getUserSales = async (req, res) => {
  // Trae todas las órdenes con producto y usuario comprador
  const orders = await Order
    .find()
    .populate({
      path: 'items.product',
      select: 'title price image user',
      populate: { path: 'user', select: 'name' }
    })
    .populate('user', 'name email'); // comprador

  // Filtra sólo las líneas en las que el producto te pertenece
  const sales = [];
  orders.forEach(order => {
    const lineasMias = order.items.filter(item =>
      item.product.user.toString() === req.user._id.toString()
    );
    if (lineasMias.length) {
      sales.push({
        orderId: order._id,
        date: order.createdAt,
        buyer: order.user,
        items: lineasMias.map(item => ({
          productId:   item.product._id,
          title:       item.product.title,
          price:       item.product.price,
          quantity:    item.quantity
        })),
        total: lineasMias.reduce((sum, i) => sum + i.price * i.quantity, 0)
      });
    }
  });

  res.json(sales);
};
