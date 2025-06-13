// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  background: ${p => p.theme.colors.surface};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,255,127,0.3);
`;

const Title = styled.h2`
  color: ${p => p.theme.colors.primary};
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media(min-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Summary = styled.div``;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: .8rem;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  padding-bottom: .5rem;
`;

const Total = styled.p`
  font-weight: bold;
  font-size: 1.2rem;
  text-align: right;
  margin-top: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  color: ${p => p.theme.colors.text};
  font-size: .9rem;
`;

const Input = styled.input`
  padding: .6rem;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 4px;
  background: transparent;
  color: ${p => p.theme.colors.text};
  font-size: 1rem;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: .8rem;
  background: ${p => p.theme.colors.primary};
  color: ${p => p.theme.colors.background};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: ${p => p.theme.colors.secondary};
  }
`;

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        // Filtra cualquier entrada sin producto válido
        const valid = res.data.filter(i => i.product && i.quantity > 0);
        setItems(valid);
      })
      .catch(console.error);
  }, []);

  // Suma segura (si product.price no existe, usa 0)
  const total = items.reduce(
    (sum, i) => sum + ((i.product?.price || 0) * i.quantity),
    0
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!shipping.name || !shipping.address) {
      alert('Por favor, completa todos los campos de envío.');
      return;
    }
    if (items.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    try {
      // Simulamos el pedido
      await api.post('/orders', {
        items: items.map(i => ({
          product: i.product._id,
          quantity: i.quantity
        })),
        shipping,
        total
      });
      // Limpiamos carrito
      await api.delete('/cart');
      alert('✅ Pago simulado completado. ¡Gracias por tu compra!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('❌ Error al procesar el pago.');
    }
  };

  return (
    <Container>
      <Title>Checkout</Title>
      <Grid>
        <Summary>
          <h3>Resumen de tu compra</h3>
          {items.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            items.map(i => (
              <Item key={i.product._id}>
                <span>{i.product.title} × {i.quantity}</span>
                <span>{( (i.product.price || 0) * i.quantity ).toFixed(2)}€</span>
              </Item>
            ))
          )}
          {items.length > 0 && (
            <Total>Total: {total.toFixed(2)}€</Total>
          )}
        </Summary>

        <Form onSubmit={handleSubmit}>
          <h3>Datos de envío</h3>
          <div>
            <Label>Nombre completo</Label>
            <Input
              name="name"
              value={shipping.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input
              name="address"
              value={shipping.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Ciudad</Label>
            <Input
              name="city"
              value={shipping.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Código Postal</Label>
            <Input
              name="zip"
              value={shipping.zip}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>País</Label>
            <Input
              name="country"
              value={shipping.country}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit">Procesar Pago (Ficticio)</Button>
        </Form>
      </Grid>
    </Container>
  );
}
