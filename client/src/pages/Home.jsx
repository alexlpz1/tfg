// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import styled from 'styled-components';

const Container = styled.main`
  background: ${p => p.theme.colors.background};
  color: ${p => p.theme.colors.text};
  min-height: 100vh;
`;

const Banner = styled.section`
  background: url(${p => p.bgUrl}) center/cover no-repeat;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 2rem;
  border-radius: 8px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    border-radius: 8px;
  }

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    height: 200px;
  }
`;

const BannerTitle = styled.h1`
  position: relative;
  color: ${p => p.theme.colors.text};
  font-size: 3rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.7);

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  color: ${p => p.theme.colors.secondary};
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 2rem;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 4px;
  background: ${p => p.theme.colors.surface};
  color: ${p => p.theme.colors.text};
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/products')
       .then(r => setProducts(r.data))
       .catch(err => console.error(err));
  }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Container>
      <Banner bgUrl="https://gamerx-demo.myshopify.com/cdn/shop/files/hero-bg.png?v=1725687619">
        <BannerTitle>Bienvenido a MarketPlace</BannerTitle>
      </Banner>

      <Section>
        <SectionTitle>Productos</SectionTitle>
        <SearchBar
          type="text"
          placeholder="Buscar producto..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <Grid>
          {filtered.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
