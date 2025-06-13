// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';

const Container = styled.main`
  background: ${p => p.theme.colors.background};
  min-height: calc(100vh - 64px);
  padding: 2rem;
`;

const Message = styled.p`
  color: ${p => p.theme.colors.subtext};
  text-align: center;
  margin-top: 4rem;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  background: ${p => p.theme.colors.surface};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 6px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const Img = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const Info = styled.div`
  flex: 1;
  padding: 0.5rem 1rem;
  color: ${p => p.theme.colors.text};
  h3 { margin: 0 0 0.5rem; }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const Btn = styled.button`
  padding: 0.4rem 0.8rem;
  background: ${p => p.theme.colors.primary};
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity .2s;
  &:hover { opacity: 0.9; }
`;

const Summary = styled.div`
  text-align: right;
  margin-top: 2rem;
  color: ${p => p.theme.colors.text};
  h2 { margin: 0; }
  > button {
    margin-top: 1rem;
  }
`;

export default function Cart() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    api.get('/cart')
      .then(res => setItems(res.data || []))
      .catch(err => {
        console.error(err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async id => {
    try {
      await api.delete(`/cart/${id}`);
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el artículo');
    }
  };

  if (loading) {
    return <Container><Message>Cargando carrito…</Message></Container>;
  }

  if (items.length === 0) {
    return <Container><Message>Tu carrito está vacío.</Message></Container>;
  }

  // Protegemos reduce de posibles nulls
  const total = items.reduce((sum, item) => {
    const prod = item.product;
    if (!prod || typeof prod.price !== 'number') return sum;
    return sum + prod.price * (item.quantity || 0);
  }, 0);

  return (
    <Container>
      {items.map(item => {
        const prod = item.product;
        if (!prod) return null;
        return (
          <Item key={item._id}>
            <Img src={prod.image} alt={prod.title} />
            <Info>
              <h3>{prod.title}</h3>
              <p>{item.quantity} × {prod.price} €</p>
            </Info>
            <Controls>
              <Btn onClick={() => handleRemove(item._id)}>
                Eliminar
              </Btn>
            </Controls>
          </Item>
        );
      })}

      <Summary>
        <h2>Total: {total.toFixed(2)} €</h2>
        <Btn onClick={() => navigate('/checkout')}>
          Proceder al pago
        </Btn>
      </Summary>
    </Container>
  );
}
