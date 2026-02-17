import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

const Wrapper = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.main`
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.foregroundSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await login(form.email, form.password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <IconCircle><LogIn size={24} /></IconCircle>
        <Title>Bem-vindo novamente, professor!</Title>
        <Subtitle>Acesse sua conta para gerenciar e publicar posts.</Subtitle>
        <Form onSubmit={handleSubmit} noValidate>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="seu@email.com" autoComplete="email" />
          <Input label="Senha" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="••••••••" autoComplete="current-password" />
          <Button type="submit" fullWidth loading={loading}>
            <LogIn size={16} /> Entrar
          </Button>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default Login;
