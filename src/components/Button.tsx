import styled, { css, keyframes } from 'styled-components';
import React from 'react';
import { ArrowLeft } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface StyledButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryHover}; transform: translateY(-1px); box-shadow: ${({ theme }) => theme.shadows.md}; }
  `,
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.foreground};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryLight}; border-color: ${({ theme }) => theme.colors.primary}; }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.foreground};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.mutedBg}; }
  `,
  destructive: css`
    background: ${({ theme }) => theme.colors.destructive};
    color: ${({ theme }) => theme.colors.destructiveForeground};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.destructiveHover}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }
  `,
  success: css`
    background: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.successForeground};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.successHover}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3); }
  `,
  outline: css`
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryForeground}; transform: translateY(-1px); }
  `,
};

const sizes = {
  sm: css`padding: 0.375rem 0.75rem; font-size: 0.8125rem;`,
  md: css`padding: 0.625rem 1.25rem; font-size: 0.875rem;`,
  lg: css`padding: 0.75rem 1.75rem; font-size: 1rem;`,
};

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  white-space: nowrap;
  ${({ $variant = 'primary' }) => variants[$variant]}
  ${({ $size = 'md' }) => sizes[$size]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  ...props
}) => (
  <StyledButton
    $variant={variant}
    $size={size}
    $fullWidth={fullWidth}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Spinner />}
    {children}
  </StyledButton>
);

export default Button;

/* Semantic Button Aliases */
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="primary" {...props} />;
export const SuccessButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="success" {...props} />;
export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="destructive" {...props} />;

interface BackButtonProps extends Omit<ButtonProps, 'variant' | 'children'> {
  label?: string;
}
export const BackButton: React.FC<BackButtonProps> = ({ label = 'Voltar', ...props }) => (
  <Button variant="outline" size="lg" {...props}>
    <ArrowLeft size={18} />
    {label}
  </Button>
);
