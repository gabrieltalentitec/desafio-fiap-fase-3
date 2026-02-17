import styled, { css } from 'styled-components';
import React from 'react';

const Wrapper = styled.div<{ $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.foreground};
`;

const inputStyles = css<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.foreground};
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.destructive : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: border-color ${({ theme }) => theme.transitions.default},
              box-shadow ${({ theme }) => theme.transitions.default};

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focusRing};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`${inputStyles}`;
const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  ${inputStyles}
  resize: vertical;
  min-height: 120px;
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.destructive};
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => {
  const inputId = id || props.name;
  return (
    <Wrapper>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput id={inputId} $hasError={!!error} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />
      {error && <ErrorText id={`${inputId}-error`} role="alert">{error}</ErrorText>}
    </Wrapper>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, id, ...props }) => {
  const inputId = id || props.name;
  return (
    <Wrapper>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledTextarea id={inputId} $hasError={!!error} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />
      {error && <ErrorText id={`${inputId}-error`} role="alert">{error}</ErrorText>}
    </Wrapper>
  );
};
