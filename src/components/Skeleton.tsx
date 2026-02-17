import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const SkeletonBlock = styled.div<{ $width?: string; $height?: string; $radius?: string }>`
  background: ${({ theme }) => theme.colors.skeleton};
  border-radius: ${({ $radius, theme }) => $radius || theme.radii.md};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '1rem'};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const PostCardSkeleton = () => (
  <SkeletonCard>
    <SkeletonBlock $height="1rem" $width="120px" $radius="9999px" />
    <SkeletonBlock $height="1.5rem" $width="70%" />
    <SkeletonBlock $height="0.875rem" />
    <SkeletonBlock $height="0.875rem" $width="85%" />
  </SkeletonCard>
);

export const PostDetailSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <SkeletonBlock $height="2.5rem" $width="80%" />
    <SkeletonBlock $height="1rem" $width="200px" />
    <SkeletonBlock $height="1rem" />
    <SkeletonBlock $height="1rem" />
    <SkeletonBlock $height="1rem" $width="90%" />
    <SkeletonBlock $height="1rem" />
    <SkeletonBlock $height="1rem" $width="70%" />
  </div>
);
