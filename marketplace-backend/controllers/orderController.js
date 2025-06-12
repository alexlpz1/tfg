import Order from '../models/Order.js';
import mongoose from 'mongoose';

// Crear orden (ya lo tenías)
export const createOrder = async (req, res) => {
  const { items, total } = req.body;
  const order = new Order({
    user: req.user._id,
    items,
    total
  });
  const created = await order.save();
  res.status(201).json(created);
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
