// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api';

function fixUrl(u){ return u?.replace(/^http:\/\//,'https://'); }

const Card = styled.div`
  background:${p=>p.theme.colors.surface};
  border:2px solid ${p=>p.theme.colors.primary};
  border-radius:8px; overflow:hidden;
  box-shadow:0 0 10px rgba(0,255,127,0.4);
  position:relative;
`;
const Badge = styled.span`
  position:absolute; top:8px; left:8px;
  background:${p=>p.theme.colors.error};
  color:#fff; padding:.2rem .6rem;
  border-radius:4px; font-size:.8rem;
`;
const Img = styled.img`
  width:100%; height:160px; object-fit:cover;
  filter:${p=>p.outOfStock?'grayscale(80%)':'none'};
`;
const Info = styled.div`padding:1rem;`;
const Name = styled.h3`
  margin:0; color:${p=>p.theme.colors.text};
`;
const Desc = styled.p`
  color:${p=>p.theme.colors.subtext};
  font-size:.9rem;
  height:40px; overflow:hidden;
`;
const Footer = styled.div`
  display:flex; justify-content:space-between;
  align-items:center; padding:.8rem 1rem;
  background:${p=>p.theme.colors.background};
`;
const Price = styled.span`
  color:${p=>p.theme.colors.secondary};
  font-weight:bold;
`;
const BtnView = styled(Link)`
  background:${p=>p.theme.colors.primary};
  color:${p=>p.theme.colors.background};
  padding:.4rem .8rem; border-radius:4px;
  margin-right:.5rem; text-decoration:none;
  &:hover{background:${p=>p.theme.colors.secondary};}
`;
const BtnAdd = styled.button`
  background:transparent; color:${p=>p.theme.colors.primary};
  border:2px solid ${p=>p.theme.colors.primary};
  padding:.3rem .6rem; border-radius:4px;
  font-size:.9rem; cursor:pointer;
  &:hover{background:${p=>p.theme.colors.primary};color:${p=>p.theme.colors.background};}
  &:disabled{opacity:.5;cursor:not-allowed;}
`;

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const out = product.stock <= 0;
  const handleAdd = async () => {
    setAdding(true);
    try {
      await api.post('/cart',{productId:product._id,quantity:1});
      alert('Añadido al carrito');
    } catch(e){
      alert(e.response?.data?.message||'Error');
    } finally { setAdding(false); }
  };
  return (
    <Card>
      {out && <Badge>Agotado</Badge>}
      <Img outOfStock={out} src={fixUrl(product.image)} alt={product.title} />
      <Info>
        <Name>{product.title}</Name>
        <Desc>{product.description}</Desc>
      </Info>
      <Footer>
        <Price>{product.price}€</Price>
        <div>
          <BtnView to={`/product/${product._id}`}>Ver</BtnView>
          <BtnAdd onClick={handleAdd} disabled={out||adding}>
            {out? 'No disponible' : adding? 'Añadiendo…' : 'Añadir'}
          </BtnAdd>
        </div>
      </Footer>
    </Card>
  );
}
