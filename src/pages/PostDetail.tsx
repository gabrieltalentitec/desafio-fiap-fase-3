import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { PostDetailSkeleton } from '../components/Skeleton';
import Button, { BackButton, DangerButton } from '../components/Button';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Edit3, Trash2, User, Calendar } from 'lucide-react';

const Container = styled.main`
  max-width: ${({ theme }) => theme.maxWidth.reading};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
`;

const BackRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ArticleCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.foreground};
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  align-items: center;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

const Content = styled.article`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.foreground};
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.muted};
`;

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.data || res.data);
      } catch (err: any) {
        if (err.status === 404) {
          setError('Post não encontrado.');
        } else {
          setError(err.message || 'Erro ao carregar post.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const isAuthor = () => {
    if (!user || !post) return false;
    // Em cenários de borda a API pode variar o formato; por isso validamos o author_id.
    const authorId = typeof post.author_id === 'string' ? post.author_id : '';
    return user._id === authorId;
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post excluído com sucesso!', { position: 'top-center' });
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir post.', { position: 'top-center' });
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  const authorName = post && typeof post.author_name === 'string' ? post.author_name : 'Autor';
  const updatedRaw = post?.updatedAt ?? (post as Post & { updateAt?: string } | null)?.updateAt ?? post?.createdAt;
  const updatedLabel = updatedRaw
    ? new Date(updatedRaw).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Container>
      <BackRow>
        <BackButton onClick={() => navigate(-1)} />
      </BackRow>

      {loading ? (
        <PostDetailSkeleton />
      ) : error ? (
        <ErrorState>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😕</p>
          <p>{error}</p>
          <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }}>Voltar para Home</Link>
        </ErrorState>
      ) : post ? (
        <ArticleCard>
          <Title>{post.title}</Title>
          <Meta>
            <MetaItem><User size={14} /> Professor {authorName}</MetaItem>
            {updatedLabel && <MetaItem><Calendar size={14} /> {updatedLabel}</MetaItem>}
          </Meta>
          <Content>{post.content}</Content>

          {/* Editar/Excluir fica restrito a professor que também seja o autor original. */}
          {isTeacher && isAuthor() && (
            <Actions>
              <Button variant="primary" onClick={() => navigate(`/posts/${id}/edit`)}>
                <Edit3 size={16} /> Editar
              </Button>
              <DangerButton onClick={() => setDeleteModal(true)}>
                <Trash2 size={16} /> Excluir
              </DangerButton>
            </Actions>
          )}
        </ArticleCard>
      ) : null}

      <Modal
        open={deleteModal}
        title="Excluir Post"
        message="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </Container>
  );
};

export default PostDetail;
