import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';

const Bg = styled.div`
  background: ${p => p.theme.colors.background};
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
`;

const Card = styled.form`
  background: ${p => p.theme.colors.surface};
  padding: 2rem;
  border-radius: 8px;
  width: 360px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  margin: 0 0 1.5rem;
  color: ${p => p.theme.colors.primary};
  text-align: center;
`;

const Field = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    margin-bottom: 0.4rem;
    color: ${p => p.theme.colors.text};
  }
  input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid ${p => p.theme.colors.border};
    border-radius: 4px;
    background: ${p => p.theme.colors.background};
    color: ${p => p.theme.colors.text};
    font-family: inherit;
  }
`;

const Submit = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: ${p => p.theme.colors.primary};
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  margin-top: 0.5rem;
  &:hover { opacity: 0.9; }
`;

export default function Register() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('userId', data._id);
    localStorage.setItem('name', data.name);
    localStorage.setItem('token', data.token);
    nav('/');
  };

  return (
    <Bg>
      <Card onSubmit={submit}>
        <Title>Crear cuenta</Title>
        <Field>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Tu nombre"
          />
        </Field>
        <Field>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="correo@ejemplo.com"
          />
        </Field>
        <Field>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="********"
          />
        </Field>
        <Submit type="submit">Registrarse</Submit>
      </Card>
    </Bg>
  );
}
