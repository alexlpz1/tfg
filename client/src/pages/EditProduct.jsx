// src/pages/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';

const Bg = styled.div`
  background: ${p => p.theme.colors.background};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormCard = styled.form`
  background: ${p => p.theme.colors.surface};
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  margin: 0 0 1.5rem;
  text-align: center;
  color: ${p => p.theme.colors.secondary};
  font-size: 1.8rem;
`;

const Field = styled.div`
  margin-bottom: 1.2rem;
  label {
    display: block;
    margin-bottom: 0.4rem;
    color: ${p => p.theme.colors.text};
    font-weight: 500;
  }
  input, textarea {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid ${p => p.theme.colors.border};
    border-radius: 4px;
    background: ${p => p.theme.colors.background};
    color: ${p => p.theme.colors.text};
    font-family: inherit;
    font-size: 1rem;
  }
  textarea { resize: vertical; min-height: 100px; }
`;

const Submit = styled.button`
  display: block;
  width: 100%;
  padding: 0.8rem;
  background: ${p => p.theme.colors.primary};
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  margin-top: 0.5rem;
  &:hover { background: ${p => p.theme.colors.secondary}; }
`;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title,       setTitle]       = useState('');
  const [price,       setPrice]       = useState('');
  const [description, setDescription] = useState('');
  const [image,       setImage]       = useState('');
  const [stock,       setStock]       = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        const p = res.data;
        setTitle(p.title);
        setPrice(p.price);
        setDescription(p.description);
        setImage(p.image);
        setStock(p.stock);            // ← cargar stock existente
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/products/${id}`, {
        title, price, description, image, stock   // ← enviar stock
      });
      navigate(`/product/${data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al actualizar');
    }
  };

  return (
    <Bg>
      <FormCard onSubmit={handleSubmit}>
        <Title>Editar producto</Title>

        <Field>
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Nombre del producto"
          />
        </Field>

        <Field>
          <label>Precio</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            placeholder="0.00"
          />
        </Field>

        <Field>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={e => setStock(e.target.value)}
            required
            placeholder="0"
            min="0"
          />
        </Field>

        <Field>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Detalles del producto"
          />
        </Field>

        <Field>
          <label>Imagen (URL)</label>
          <input
            type="text"
            value={image}
            onChange={e => setImage(e.target.value)}
            required
            placeholder="https://..."
          />
        </Field>

        <Submit type="submit">Guardar cambios</Submit>
      </FormCard>
    </Bg>
  );
}
