// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import styled from 'styled-components';
import heroImg from '../assets/hero.png';



const Container = styled.main`
  display: flex;
  flex-direction: column;
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

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data));
  }, []);

  return (
    <Container>
      <Hero>
        <HeroText>
          <h1>Plataforma de venta online</h1>
          <p>
            Vende los productos que quieras
          </p>
          <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            Shop Now 🛒
          </button>
        </HeroText>
        <HeroImage>
          <img src={heroImg} alt="Hero gaming" />
        </HeroImage>
      </Hero>

      <SectionTitle>Productos Destacados</SectionTitle>
      <Grid>
        {products.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </Grid>
    </Container>
  );
}
