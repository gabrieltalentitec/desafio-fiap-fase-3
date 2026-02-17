import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Post } from '../types';
import Button, { DangerButton, PrimaryButton } from '../components/Button';
import Modal from '../components/Modal';
import { PostCardSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { Eye, Edit3, Trash2, PlusCircle, Shield, User } from 'lucide-react';

const Container = styled.main`
  max-width: ${({ theme }) => theme.maxWidth.list};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PostInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.foreground};
`;

const PostMeta = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.125rem;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 2px dashed ${({ theme }) => theme.colors.borderLight};
`;

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      const data = res.data.data || res.data;
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao carregar posts.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${deleteId}`);
      toast.success('Post excluído com sucesso!', { position: 'top-center' });
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir post.', { position: 'top-center' });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <Container>
      <Header>
        <Title><Shield size={22} /> Administração</Title>
        <PrimaryButton onClick={() => navigate('/posts/new')}>
          <PlusCircle size={16} /> Novo Post
        </PrimaryButton>
      </Header>

      {loading ? (
        <Table>
          {[1, 2, 3, 4].map((i) => <PostCardSkeleton key={i} />)}
        </Table>
      ) : posts.length === 0 ? (
        <EmptyState>
          <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</p>
          <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Nenhum post encontrado.</p>
          <PrimaryButton onClick={() => navigate('/posts/new')}>
            <PlusCircle size={16} /> Criar primeiro post
          </PrimaryButton>
        </EmptyState>
      ) : (
        <Table>
          {posts.map((post) => {
            const authorName = typeof post.author_name === 'string' ? post.author_name : 'Autor';
            return (
              <Row key={post._id}>
                <PostInfo>
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta><User size={12} /> {authorName}</PostMeta>
                </PostInfo>
                <Actions>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/posts/${post._id}`)}>
                    <Eye size={14} /> Ver
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => navigate(`/posts/${post._id}/edit`)}>
                    <Edit3 size={14} /> Editar
                  </Button>
                  <DangerButton size="sm" onClick={() => setDeleteId(post._id)}>
                    <Trash2 size={14} /> Excluir
                  </DangerButton>
                </Actions>
              </Row>
            );
          })}
        </Table>
      )}

      <Modal
        open={!!deleteId}
        title="Excluir Post"
        message="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default Admin;
