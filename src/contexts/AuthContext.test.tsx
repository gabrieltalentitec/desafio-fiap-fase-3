import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Cookies from 'js-cookie';
import api from '../services/api';

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

const cookies = Cookies as unknown as {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

const mockedApi = api as unknown as {
  post: ReturnType<typeof vi.fn>;
};

const AuthProbe = () => {
  const { user, isAuthenticated, isTeacher, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="is-auth">{String(isAuthenticated)}</p>
      <p data-testid="is-teacher">{String(isTeacher)}</p>
      <p data-testid="user-name">{user?.name ?? 'none'}</p>
      <button onClick={() => login('teacher@fiap.com', '123456')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cookies.get.mockReturnValue(undefined);
  });

  it('restaura sessão válida a partir dos cookies', async () => {
    cookies.get.mockImplementation((key: string) => {
      if (key === 'auth_token') return 'token-123';
      if (key === 'auth_user') return JSON.stringify({
        _id: 'u1',
        name: 'Professor Teste',
        email: 'teacher@fiap.com',
        role: 'teacher',
      });
      return undefined;
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
    });
    expect(screen.getByTestId('is-teacher')).toHaveTextContent('true');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Professor Teste');
  });

  it('remove cookies inválidos quando auth_user está corrompido', async () => {
    cookies.get.mockImplementation((key: string) => {
      if (key === 'auth_token') return 'token-123';
      if (key === 'auth_user') return '{invalid-json';
      return undefined;
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(cookies.remove).toHaveBeenCalledWith('auth_token');
    });
    expect(cookies.remove).toHaveBeenCalledWith('auth_user');
    expect(screen.getByTestId('is-auth')).toHaveTextContent('false');
  });

  it('executa login e persiste token + usuário em cookie', async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: {
        data: {
          token: 'token-login',
          user: {
            _id: 'u2',
            name: 'Teacher Login',
            email: 'login@fiap.com',
            role: 'teacher',
          },
        },
      },
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('login'));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'teacher@fiap.com',
        password: '123456',
      });
    });

    expect(cookies.set).toHaveBeenCalledWith('auth_token', 'token-login', { expires: 7 });
    expect(cookies.set).toHaveBeenCalledWith(
      'auth_user',
      JSON.stringify({
        _id: 'u2',
        name: 'Teacher Login',
        email: 'login@fiap.com',
        role: 'teacher',
      }),
      { expires: 7 }
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
    });
  });
});
