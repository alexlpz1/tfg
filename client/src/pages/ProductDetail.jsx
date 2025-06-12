import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';

const Container = styled.main`
  background: ${p => p.theme.colors.background};
  min-height: calc(100vh - 64px);
  padding: 2rem;
  display: flex;
  gap: 2rem;
`;

const ImgSection = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const Preview = styled.img`
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const InfoSection = styled.div`
  flex: 1;
  color: ${p => p.theme.colors.text};
`;

const Title = styled.h1`
  color: ${p => p.theme.colors.primary};
  margin: 0 0 1rem;
  font-size: 2rem;
`;

const Price = styled.p`
  font-size: 1.2rem;
  color: ${p => p.theme.colors.secondary};
  margin: 0.5rem 0;
`;

const Description = styled.p`
  line-height: 1.5;
  color: ${p => p.theme.colors.subtext};
`;

const Actions = styled.div`
  margin: 1.5rem 0;
  & > button {
    margin-right: 1rem;
  }
`;

const ActionBtn = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  background: ${p => p.danger ? p.theme.colors.error : p.theme.colors.primary};
  color: #fff;
  &:hover {
    opacity: 0.9;
  }
`;

const Comments = styled.section`
  margin-top: 2rem;
`;

const CommentTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${p => p.theme.colors.primary};
`;

const CommentItem = styled.div`
  padding: 0.8rem 1rem;
  border-top: 1px solid ${p => p.theme.colors.border};
  & + & { margin-top: 0.5rem; }
  b { color: ${p => p.theme.colors.secondary}; }
`;

const CommentForm = styled.form`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  resize: vertical;
  min-height: 80px;
  padding: 0.6rem;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 4px;
  background: ${p => p.theme.colors.surface};
  color: ${p => p.theme.colors.text};
  font-family: inherit;
`;

const Submit = styled.button`
  align-self: flex-end;
  margin-top: 0.8rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  background: ${p => p.theme.colors.primary};
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const me = localStorage.getItem('userId');

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data));
    api.get(`/comments/${id}`).then(r => setComments(r.data));
  }, [id]);

  const handleComment = async e => {
    e.preventDefault();
    const { data } = await api.post(`/comments/${id}`, { text });
    setComments(prev => [...prev, data]);
    setText('');
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    await api.delete(`/products/${id}`);
    nav('/');
  };

  if (!product) return <Container><p>Cargando…</p></Container>;

  return (
    <Container>
      <ImgSection>
        <Preview src={product.image} alt={product.title} />
      </ImgSection>
      <InfoSection>
        <Title>{product.title}</Title>
        <Price>Precio: {product.price}€</Price>
        <Description>{product.description}</Description>

        {me === product.user._id && (
          <Actions>
            <ActionBtn onClick={() => nav(`/product/${id}/edit`)}>
              Editar
            </ActionBtn>
            <ActionBtn danger onClick={handleDelete}>
              Eliminar
            </ActionBtn>
          </Actions>
        )}

        <Comments>
          <CommentTitle>Comentarios</CommentTitle>
          {comments.length === 0
            ? <p>No hay comentarios.</p>
            : comments.map(c => (
                <CommentItem key={c._id}>
                  <b>{c.user.name}:</b> {c.text}
                </CommentItem>
              ))
          }
          <CommentForm onSubmit={handleComment}>
            <TextArea
              value={text}
              onChange={e => setText(e.target.value)}
              required
              placeholder="Escribe tu comentario..."
            />
            <Submit type="submit">Enviar comentario</Submit>
          </CommentForm>
        </Comments>
      </InfoSection>
    </Container>
  );
}
