// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import styled from 'styled-components';
import heroImg from '../assets/hero.png';
import { hero } from '../theme';



const Container = styled.main`
  background: ${p=>p.theme.colors.background};
  color: ${p=>p.theme.colors.text};
  min-height: 100vh;
`;

const Hero = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background:rgb(0, 0, 0);
  padding: 4rem 2rem;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    text-align: center;
  }
`;
const Banner = styled.section`
  background: url(${p => p.bgUrl}) center/cover no-repeat;
  height: ${hero.height};
  display: flex; align-items: center; justify-content: center;
  position: relative;
  &::after {
    content: ''; position:absolute; inset:0;
    background: rgba(0,0,0,0.5);
  }
`;


const BannerText = styled.h1`
  position: relative; color: ${p=>p.theme.colors.primary};
  font-size: 2.5rem; text-align:center;
  @media(max-width:${p=>p.theme.breakpoints.tablet}) {
    font-size: 1.8rem;
  }
`;

const Section = styled.section`
  max-width: 1200px; margin: -4rem auto 2rem;
  padding: 0 1rem;
`;

const Title = styled.h2`
  color: ${p=>p.theme.colors.secondary};
  margin-bottom: 1rem;
`;

const SearchBar = styled.input`
  width:100%; padding:.6rem; margin-bottom:1.5rem;
  border:1px solid ${p=>p.theme.colors.border};
  border-radius:4px; background:${p=>p.theme.colors.surface};
  color:${p=>p.theme.colors.text};
`;

const HeroText = styled.div`
  flex: 1;
  max-width: 500px;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${p => p.theme.colors.primary};
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  button {
    round: ${p => p.theme.colors.primabackgry};
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
    &:hover {
      background: darken(${p => p.theme.colors.primary}, 10%);
    }
  }
`;

const HeroImage = styled.div`
  flex: 1;
  img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin: 3rem 0 1.5rem;
  font-size: 2.5rem;
  color: ${p => p.theme.colors.primary};
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  padding: 0 2rem 4rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  useEffect(()=> {
    api.get('/products').then(r=>setProducts(r.data));
  },[]);
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <Container>
      <Banner bgUrl="https://gamerx-demo.myshopify.com/cdn/shop/files/hero-bg.png?v=1725687619">
        <BannerTitle>Bienvenido a MarketPlace</BannerTitle>
      </Banner>
      <Section>
        <Title>Productos</Title>
        <SearchBar
          placeholder="Buscar producto..."
          value={q} onChange={e=>setQ(e.target.value)}
        />
        <Grid>
          {filtered.map(p=> <ProductCard key={p._id} product={p}/>)}
        </Grid>
      </Section>
    </Container>
  );
}