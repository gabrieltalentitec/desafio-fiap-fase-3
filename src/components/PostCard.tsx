import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Eye, User, Calendar } from 'lucide-react';

const CardWrapper = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.default};
  text-decoration: none;
  color: inherit;
  box-shadow: ${({ theme }) => theme.shadows.card};
  animation: fadeInUp 0.4s ease both;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-3px);
    color: inherit;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AuthorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  padding: 0.25rem 0.625rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 500;
`;

const ViewIcon = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  transition: color ${({ theme }) => theme.transitions.default};

  ${CardWrapper}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.3;
`;

const Preview = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.foregroundSecondary};
  line-height: 1.6;
`;

const Meta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.muted};
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const authorName = typeof post.author_name === 'string' ? post.author_name : 'Autor desconhecido';
  const preview = post.content.length > 120 ? post.content.slice(0, 120) + '…' : post.content;
  const updatedRaw = post.updatedAt ?? (post as Post & { updateAt?: string }).updateAt ?? post.createdAt;
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
    <CardWrapper to={`/posts/${post._id}`}>
      <article>
        <CardHeader>
          <AuthorBadge>
            <User size={12} />
            Professor {authorName}
          </AuthorBadge>
          <ViewIcon>
            <Eye size={16} />
          </ViewIcon>
        </CardHeader>
        <Title>{post.title}</Title>
        <Preview>{preview}</Preview>
        {updatedLabel && (
          <Meta>
            <Calendar size={12} />
            {updatedLabel}
          </Meta>
        )}
      </article>
    </CardWrapper>
  );
};

export default PostCard;
