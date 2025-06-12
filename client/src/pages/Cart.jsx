import React, { useEffect, useState } from 'react';
import { useNavigate }           from 'react-router-dom';
import api                       from '../api';

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate           = useNavigate();

  useEffect(() => {
    api.get('/cart').then(r => setItems(r.data));
  }, []);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    try {
      await api.post('/orders', { items: items.map(i => ({ product: i.product._id, quantity: i.quantity })), total });
      alert('🎉 ¡Pago completado!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Error al procesar el pago');
    }
  };

  if (!items.length) return <p>Tu carrito está vacío</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Tu Carrito</h2>
      {items.map(i => (
        <div key={i._id}>{i.product.title} x{i.quantity} — {i.product.price * i.quantity}€</div>
      ))}
      <h3>Total: {total}€</h3>
      <button onClick={handleCheckout}>Completar Pago</button>
    </div>
  );
}
