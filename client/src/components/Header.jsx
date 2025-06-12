import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Bar = styled.header`
  background: ${p => p.theme.colors.surface};
  border-bottom: 2px solid ${p => p.theme.colors.primary};
  padding: 0 2rem;
`;
const Nav = styled.nav`
  display: flex;
  align-items: center;
  height: 64px;
  justify-content: space-between;
`;
const Logo = styled(Link)`
  color: ${p => p.theme.colors.primary};
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
`;
const Links = styled.div`
  display: flex;
  gap: 1rem;
`;
const Btn = styled.button`
  background: transparent;
  border: 1px solid ${p => p.theme.colors.primary};
  color: ${p => p.theme.colors.primary};
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  &:hover {
    background: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.background};
  }
`;

export default function Header() {
  const nav = useNavigate();
  const token = localStorage.getItem('token');
  const name  = localStorage.getItem('name');
  const logout = () => { localStorage.clear(); nav('/'); };

  return (
    <Bar>
      <Nav>
        <Logo to="/">MarketPlace</Logo>
        <Links>
          <Btn onClick={()=>nav('/create')}>Vender</Btn>
          <Btn onClick={()=>nav('/cart')}>Carrito</Btn>
          {!token ? (
            <>
              <Btn onClick={()=>nav('/login')}>Entrar</Btn>
              <Btn onClick={()=>nav('/register')}>Registro</Btn>
            </>
          ) : (
            <>
              <Btn onClick={()=>nav('/profile')}>{name}</Btn>
              <Btn onClick={logout}>Salir</Btn>
            </>
          )}
        </Links>
      </Nav>
    </Bar>
  );
}
