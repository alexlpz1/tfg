// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api';
import ProductCard from '../components/ProductCard';

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4rem;
`;

const Banner = styled.div`
  width: 100%;
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}99,
    ${({ theme }) => theme.colors.secondary}99
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom-left-radius: 50% 10%;
  border-bottom-right-radius: 50% 10%;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background: ${({ theme }) => theme.colors.surface};
  border: 4px solid ${({ theme }) => theme.colors.background};
  border-radius: 50%;
  margin-bottom: 1rem;
  /* Puedes sustituirlo por una <img> si tienes avatar real */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Name = styled.h1`
  margin: 0.5rem 0 0.2rem;
  color: ${({ theme }) => theme.colors.background};
  font-size: 2rem;
`;

const Email = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.background};
  opacity: 0.8;
`;

const LogoutButton = styled.button`
  margin-top: 1.5rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.8rem;
  margin-bottom: 1rem;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 60px;
    height: 4px;
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

const NoProducts = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 1.1rem;
  margin: 2rem 0;
`;

export default function Profile() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const mine = res.data.filter(p => p.user._id === userId);
        setProducts(mine);
      })
      .catch(console.error);
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <ProfileWrapper>
      <Banner>
        <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
        <Name>{name}</Name>
        {email && <Email>{email}</Email>}
        <LogoutButton onClick={handleLogout}>Cerrar sesión</LogoutButton>
      </Banner>

      <Section>
        <SectionTitle>Tus productos en venta</SectionTitle>
        {products.length > 0 ? (
          <Grid>
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </Grid>
        ) : (
          <NoProducts>No tienes productos publicados aún.</NoProducts>
        )}
      </Section>
    </ProfileWrapper>
  );
}
