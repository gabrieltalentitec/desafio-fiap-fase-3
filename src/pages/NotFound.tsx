import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/Button';
import { Home } from 'lucide-react';

const Container = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-width: 480px;
  width: 100%;
`;

const Code = styled.span`
  font-size: 5rem;
  font-weight: 800;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const NotFound = () => (
  <Container>
    <Card>
      <Code>Ops!</Code>
      <Message>Página não encontrada.</Message>
      <Link to="/">
        <BackButton label="Voltar para Home" />
      </Link>
    </Card>
  </Container>
);

export default NotFound;
