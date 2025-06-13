// controllers/orderController.js
import Order   from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * Crea una nueva orden, descontando stock de cada producto.
 */
export const createOrder = async (req, res) => {
  try {
    const { items, shipping, total } = req.body;

    // 1) Validar y descontar stock
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

    // 2) Crear la orden
    const order = new Order({
      user:     req.user._id,
      items,
      shipping,
      total
    });
    const saved = await order.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error('❌ Error creando orden:', err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Devuelve todas las órdenes del usuario autenticado.
 */
export const getOrdersForUser = async (req, res) => {
  try {
    const orders = await Order
      .find({ user: req.user._id })
      .populate('items.product', 'title price image'); 
    res.json(orders);
  } catch (err) {
    console.error('❌ Error obteniendo órdenes:', err);
    res.status(500).json({ message: err.message });
  }
};
