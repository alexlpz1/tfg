import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';

function fixUrl(u) {
  return u?.replace(/^http:\/\//, 'https://') || '';
}

const Container = styled.main`
  background: ${p => p.theme.colors.background};
  min-height: calc(100vh - 64px);
  padding: 2rem;
  display: flex;
  gap: 2rem;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    flex-direction: column;
    padding: 1rem;
  }
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  filter: ${p => p.outOfStock ? 'grayscale(70%)' : 'none'};
`;

const InfoSection = styled.div`
  flex: 1;
  color: ${p => p.theme.colors.text};
`;

const Title = styled.h1`
  color: ${p => p.theme.colors.primary};
  margin: 0 0 1rem;
  font-size: 2.2rem;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    font-size: 1.8rem;
  }
`;

const Price = styled.p`
  font-size: 1.3rem;
  color: ${p => p.theme.colors.secondary};
  margin: 0.5rem 0;
`;

const Stock = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: ${p => p.outOfStock ? p.theme.colors.error : p.theme.colors.primary};
  margin: 0.5rem 0 1rem;
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
  color: #000;
  transition: opacity .2s;
  &:hover { opacity: 0.9; }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: opacity .2s;
  &:hover { opacity: 0.9; }
`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct]   = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState('');
  const userId = localStorage.getItem('userId');

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
    navigate('/');
  };

  if (!product) {
    return <Container><p>Cargando…</p></Container>;
  }

  const outOfStock = product.stock <= 0;

  return (
    <Container>
      <ImgSection>
        <Preview
          outOfStock={outOfStock}
          src={fixUrl(product.image)}
          alt={product.title}
        />
      </ImgSection>

      <InfoSection>
        <Title>{product.title}</Title>
        <Price>Precio: {product.price}€</Price>
        <Stock outOfStock={outOfStock}>
          {outOfStock ? 'Agotado' : `En stock: ${product.stock}`}
        </Stock>

        <Actions>
          <ActionBtn
            onClick={async () => {
              try {
                await api.post('/cart', { productId: id, quantity: 1 });
                alert('Añadido al carrito');
              } catch {
                alert('Error al añadir al carrito');
              }
            }}
            disabled={outOfStock}
          >
            {outOfStock ? 'No disponible' : 'Añadir al carrito'}
          </ActionBtn>

          {userId === product.user._id && (
            <>
              <ActionBtn onClick={() => navigate(`/product/${id}/edit`)}>
                Editar
              </ActionBtn>
              <ActionBtn danger onClick={handleDelete}>
                Eliminar
              </ActionBtn>
            </>
          )}
        </Actions>

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
