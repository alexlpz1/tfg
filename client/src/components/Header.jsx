// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX } from 'react-icons/fi';

const Bar = styled.header`
  background: ${p => p.theme.colors.surface};
  border-bottom: 2px solid ${p => p.theme.colors.primary};
  padding: 0 1rem;

  @media (min-width: ${p => p.theme.breakpoints.tablet}) {
    padding: 0 2rem;
  }
`;
const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;
const Logo = styled(Link)`
  color: ${p => p.theme.colors.primary};
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
`;
const Links = styled.div`
  display: ${p => p.open ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  top: 64px; right: 0;
  background: ${p => p.theme.colors.surface};
  width: 200px;
  padding: 1rem;
  gap: 0.5rem;

  a, button {
    width: 100%;
  }

  @media (min-width: ${p => p.theme.breakpoints.tablet}) {
    position: static;
    flex-direction: row;
    background: transparent;
    width: auto;
    padding: 0;
    display: flex;
    gap: 1rem;
  }
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
const MenuToggle = styled.button`
  background: none;
  border: none;
  color: ${p => p.theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  @media (min-width: ${p => p.theme.breakpoints.tablet}) {
    display: none;
  }
`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const token = localStorage.getItem('token');
  const name  = localStorage.getItem('name');
  const logout = () => { localStorage.clear(); nav('/'); };

  return (
    <Bar>
      <Nav>
        <Logo to="/">MarketPlace</Logo>
        <MenuToggle onClick={()=>setOpen(o=>!o)}>
          {open ? <FiX/> : <FiMenu/>}
        </MenuToggle>
        <Links open={open}>
          <Btn as="a" onClick={()=>nav('/create')}>Vender</Btn>
          <Btn as="a" onClick={()=>nav('/cart')}>Carrito</Btn>
          {!token
            ? <>
                <Btn as="a" onClick={()=>nav('/login')}>Entrar</Btn>
                <Btn as="a" onClick={()=>nav('/register')}>Registro</Btn>
              </>
            : <>
                <Btn as="a" onClick={()=>nav('/profile')}>{name}</Btn>
                <Btn onClick={logout}>Salir</Btn>
              </>
          }
        </Links>
      </Nav>
    </Bar>
  );
}
