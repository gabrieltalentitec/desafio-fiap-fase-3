import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import api from '../services/api';
import { Input } from '../components/Input';
import { Textarea } from '../components/Input';
import { SuccessButton, DangerButton, BackButton } from '../components/Button';
import { PostDetailSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';

const Container = styled.main`
  max-width: ${({ theme }) => theme.maxWidth.reading};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
`;

const BackRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const schema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
});

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const post = res.data.data || res.data;
        setForm({ title: post.title, content: post.content });
      } catch (err: any) {
        if (err.status === 403) {
          toast.error('Você não tem permissão para editar este post.', { position: 'top-center' });
          navigate('/');
        } else if (err.status === 404) {
          navigate('/not-found');
        } else {
          toast.error(err.message || 'Erro ao carregar post.', { position: 'top-center' });
        }
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await api.put(`/posts/${id}`, form);
      toast.success('Post atualizado com sucesso!');
      navigate('/');
    } catch (err: any) {
      if (err.status === 403) {
        toast.error('Você não tem permissão para editar este post.', { position: 'top-center' });
        navigate('/');
      } else {
        toast.error(err.message || 'Erro ao atualizar post.', { position: 'top-center' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Container><PostDetailSkeleton /></Container>;

  return (
    <Container>
      <BackRow>
        <BackButton onClick={() => navigate(-1)} />
      </BackRow>
      <Card>
        <Title>Editar Post</Title>
        <Form onSubmit={handleSubmit} noValidate>
          <Input label="Título" name="title" value={form.title} onChange={handleChange} error={errors.title} />
          <Textarea label="Conteúdo" name="content" value={form.content} onChange={handleChange} error={errors.content} rows={12} />
          <Actions>
            <SuccessButton type="submit" loading={loading}>
              <Save size={16} /> Salvar
            </SuccessButton>
            <DangerButton type="button" onClick={() => navigate(-1)}>
              <X size={16} /> Cancelar
            </DangerButton>
          </Actions>
        </Form>
      </Card>
    </Container>
  );
};

export default EditPost;
