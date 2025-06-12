// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api';

function fixUrl(u) {
  if (!u) return u;
  // Si viene con "http://…" lo cambiamos a "https://"
  return u.replace(/^http:\/\//, 'https://');

}
const Card = styled.div`
  background: ${p => p.theme.colors.surface};
  border: 2px solid ${p => p.theme.colors.primary};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0,255,127,0.4);
  transition: transform .2s, box-shadow .2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(0,255,127,0.7);
  }
`;
const Img = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;
const Info = styled.div`
  padding: 1rem;
`;
const Name = styled.h2`
  margin: 0;
  color: ${p => p.theme.colors.text};
  font-size: 1.1rem;
`;
const Desc = styled.p`
  color: ${p => p.theme.colors.subtext};
  font-size: .9rem;
  height: 40px;
  overflow: hidden;
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .8rem 1rem;
  background: ${p => p.theme.colors.background};
`;
const Price = styled.span`
  color: ${p => p.theme.colors.secondary};
  font-weight: bold;
`;
// botón “Ver”
const BtnView = styled(Link)`
  background: ${p => p.theme.colors.primary};
  color: ${p => p.theme.colors.background};
  padding: .4rem .8rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: .9rem;
  margin-right: .5rem;
  &:hover {
    background: ${p => p.theme.colors.secondary};
  }
`;
// botón “Añadir al carrito”
const BtnAdd = styled.button`
  background: transparent;
  color: ${p => p.theme.colors.primary};
  border: 2px solid ${p => p.theme.colors.primary};
  padding: .3rem .6rem;
  border-radius: 4px;
  font-size: .9rem;
  cursor: pointer;
  transition: background .2s, color .2s;
  &:hover {
    background: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.background};
  }
`;
export default function ProductCard({ product }) {
  return (
    <Card>
      {/* 2) Usa fixUrl() en lugar de product.image */}
      <Img src={fixUrl(product.image)} alt={product.title} />
      {/* … resto del JSX */}
    </Card>
  );
}
export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      // Asume que tu endpoint espera { productId, quantity }
      await api.post('/cart', { productId: product._id, quantity: 1 });
      alert('Producto añadido al carrito');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al añadir al carrito');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card>
      <Img src={product.image} alt={product.title}/>
      <Info>
        <Name>{product.title}</Name>
        <Desc>{product.description}</Desc>
      </Info>
      <Footer>
        <Price>{product.price}€</Price>
        <div>
          <BtnView to={`/product/${product._id}`}>Ver</BtnView>
          <BtnAdd onClick={handleAddToCart} disabled={adding}>
            {adding ? 'Añadiendo…' : 'Añadir'}
          </BtnAdd>
        </div>
      </Footer>
    </Card>
  );
}
