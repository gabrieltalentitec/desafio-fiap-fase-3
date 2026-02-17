import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isTeacher: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessão a partir dos cookies ao iniciar a aplicação.
  useEffect(() => {
    const savedToken = Cookies.get('auth_token');
    const savedUser = Cookies.get('auth_user');
    if (savedToken && savedUser) {
      try {
        // Mantém estado em memória, mas a fonte de verdade continua no cookie.
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        // Se o cookie estiver corrompido, remove para evitar estado de auth inconsistente.
        Cookies.remove('auth_token');
        Cookies.remove('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const saveSession = (authData: AuthResponse) => {
    // Cookie de 7 dias mantém sessão entre refreshes do navegador.
    Cookies.set('auth_token', authData.token, { expires: 7 });
    Cookies.set('auth_user', JSON.stringify(authData.user), { expires: 7 });
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data.data || res.data;
    saveSession(data);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const data = res.data.data || res.data;
    saveSession(data);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('auth_token');
    Cookies.remove('auth_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isTeacher: user?.role === 'teacher',
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
