import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute, TeacherRoute } from './RouteGuards';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../contexts/AuthContext';

const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;

const renderWithRouter = (ui: React.ReactNode, initialEntry = '/private') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/private" element={ui} />
        <Route path="/teacher" element={ui} />
        <Route path="/login" element={<div>login page</div>} />
        <Route path="/" element={<div>home page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('RouteGuards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('PrivateRoute redireciona para login quando não autenticado', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isTeacher: false,
      loading: false,
    });

    renderWithRouter(
      <PrivateRoute>
        <div>private content</div>
      </PrivateRoute>
    );

    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('PrivateRoute renderiza children quando autenticado', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isTeacher: false,
      loading: false,
    });

    renderWithRouter(
      <PrivateRoute>
        <div>private content</div>
      </PrivateRoute>
    );

    expect(screen.getByText('private content')).toBeInTheDocument();
  });

  it('TeacherRoute redireciona para home quando usuário não é teacher', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isTeacher: false,
      loading: false,
    });

    renderWithRouter(
      <TeacherRoute>
        <div>teacher content</div>
      </TeacherRoute>,
      '/teacher'
    );

    expect(screen.getByText('home page')).toBeInTheDocument();
  });

  it('TeacherRoute renderiza children quando usuário é teacher', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isTeacher: true,
      loading: false,
    });

    renderWithRouter(
      <TeacherRoute>
        <div>teacher content</div>
      </TeacherRoute>,
      '/teacher'
    );

    expect(screen.getByText('teacher content')).toBeInTheDocument();
  });
});
