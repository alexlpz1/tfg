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

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  img.preview {
    display: block;
    margin-top: 0.8rem;
    max-width: 100%;
    border-radius: 4px;
  }
`;

const Submit = styled.button`
  display: block;
  width: 100%;
  padding: 0.8rem;
  background: ${p => p.theme.colors.primary};
  border: none;
  border-radius: 4px;
  color: ${p => p.theme.colors.background};
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  margin-top: 0.5rem;
  opacity: ${p => (p.disabled ? 0.6 : 1)};

  &:hover {
    background: ${p => !p.disabled && p.theme.colors.secondary};
  }
`;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle]             = useState('');
  const [price, setPrice]             = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage]             = useState('');
  const [uploading, setUploading]     = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setPrice(res.data.price);
        setDescription(res.data.description);
        setImage(res.data.image);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(data.url);
    } catch (err) {
      console.error(err);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!image) {
      alert('Por favor sube una imagen antes de guardar');
      return;
    }
    try {
      const { data } = await api.put(`/products/${id}`, {
        title, price, description, image
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
        <Title>Editar Producto</Title>

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
          <label>Precio (€)</label>
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
          <label>Cambiar Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && <p>Cargando imagen…</p>}
          {image && <img src={image} alt="Vista previa" className="preview" />}
        </Field>

        <Submit type="submit" disabled={uploading}>
          {uploading ? 'Subiendo…' : 'Guardar cambios'}
        </Submit>
      </FormCard>
    </Bg>
  );
}
