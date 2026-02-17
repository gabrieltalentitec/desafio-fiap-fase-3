import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.foreground};
`;

const StyledSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.foreground};
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.destructive : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.default};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focusRing};
  }
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.destructive};
`;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, error, options, id, ...props }) => {
  const selectId = id || props.name;
  return (
    <Wrapper>
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <StyledSelect id={selectId} $hasError={!!error} aria-invalid={!!error} {...props}>
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </StyledSelect>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </Wrapper>
  );
};

export default Select;
