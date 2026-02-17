import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { SuccessButton } from '../components/Button';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

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
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form.name, form.email, form.password, 'teacher');
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <IconCircle><UserPlus size={24} /></IconCircle>
        <Title>Cadastrar Professor</Title>
        <Subtitle>Crie uma nova conta de professor na plataforma</Subtitle>
        <Form onSubmit={handleSubmit} noValidate>
          <Input label="Nome" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Nome completo" autoComplete="name" />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="email@exemplo.com" autoComplete="email" />
          <Input label="Senha" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
          <SuccessButton type="submit" fullWidth loading={loading}>
            <UserPlus size={16} /> Criar Conta
          </SuccessButton>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default Register;
