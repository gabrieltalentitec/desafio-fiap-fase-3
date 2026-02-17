import styled from 'styled-components';
import React, { useEffect, useCallback } from 'react';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
  animation: fadeInUp 0.2s ease;
`;

const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 480px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(220, 38, 38, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.destructive};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.foregroundSecondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

interface ModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar',
  variant = 'destructive', loading = false, onConfirm, onCancel,
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <ModalBox onClick={(e) => e.stopPropagation()}>
        {variant === 'destructive' && (
          <IconWrapper>
            <AlertTriangle size={24} />
          </IconWrapper>
        )}
        <Title id="modal-title">{title}</Title>
        <Message>{message}</Message>
        <Actions>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'primary'} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </Actions>
      </ModalBox>
    </Overlay>
  );
};

export default Modal;
