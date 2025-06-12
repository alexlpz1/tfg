// src/pages/CreateProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Preview = styled.img`
  display: block;
  max-width: 200px;
  margin: 1rem auto;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0,255,127,0.3);
`;

export default function CreateProduct() {
  const [title, setTitle]         = useState('');
  const [price, setPrice]         = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage]         = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // 1) Subida de fichero
  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      // Llamamos a /api/upload (baseURL + '/upload')
      const { data } = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(data.url);
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      alert('No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!image) {
      alert('Espera a que la imagen termine de subirse');
      return;
    }
    try {
      const { data } = await api.post('/products', {
        title, price, description, image
      });
      navigate(`/product/${data._id}`);
    } catch (err) {
      console.error('Error publicando:', err.response?.data);
      alert(err.response?.data?.message || 'Error al publicar. ¿Estás logueado?');
    }
  };

  return (
    <Bg>
      <FormCard onSubmit={handleSubmit}>
        <Title>Publicar Nuevo Producto</Title>

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
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            placeholder="0.00"
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
          <label>Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          { uploading && <p>Cargando imagen…</p> }
          { image && <Preview src={image} alt="Vista previa" /> }
        </Field>

        <Submit type="submit">Publicar</Submit>
      </FormCard>
    </Bg>
  );
}
