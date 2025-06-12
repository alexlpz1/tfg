import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';

const Bg = styled.div`
  background: url('/assets/gaming-bg.jpg') center/cover no-repeat;
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
`;
const Card = styled.form`
  background: rgba(26,26,26,0.9);
  padding: 2rem;
  border: 2px solid ${p=>p.theme.colors.primary};
  border-radius: 8px;
  width: 320px;
  h2 { color: ${p=>p.theme.colors.primary}; text-align:center; margin-bottom:1rem;}
  input {
    width:100%; padding:.6rem; margin:.8rem 0;
    background: ${p=>p.theme.colors.surface}; border:none; border-radius:4px;
    color: ${p=>p.theme.colors.text};
  }
  button {
    width:100%; padding:.8rem; margin-top:1rem;
    background: ${p=>p.theme.colors.primary};
    border:none; border-radius:4px; color: ${p=>p.theme.colors.background};
    font-weight:bold; cursor:pointer;
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const { data } = await api.post('/auth/login', { email, password: pw });
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('userId', data._id);
    nav('/');
  };

  return (
    <Bg>
      <Card onSubmit={submit}>
        <h2>Login</h2>
        <input
          type="email" placeholder="Email"
          value={email} onChange={e=>setEmail(e.target.value)}
          required />
        <input
          type="password" placeholder="Contraseña"
          value={pw} onChange={e=>setPw(e.target.value)}
          required />
        <button type="submit">Entrar</button>
      </Card>
    </Bg>
  );
}
