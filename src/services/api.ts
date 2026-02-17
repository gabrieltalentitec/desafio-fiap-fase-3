import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// Toda requisição tenta reaproveitar o token do cookie para evitar header manual nas páginas.
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza erros da API em um único ponto para as telas receberem `{ status, message }`.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Erro inesperado. Tente novamente.';

    if (status === 401) {
      // Token inválido/expirado: limpa sessão e força novo login.
      Cookies.remove('auth_token');
      toast.error('Sessão expirada. Faça login novamente.');
      // Só redireciona se o usuário ainda não estiver na tela de login.
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      // toast.error('Acesso proibido.');
      console.warn('Acesso proibido.');
    } else if (status === 404) {
      // Deixa cada página tratar 404 conforme o fluxo da tela.
    }

    return Promise.reject({ status, message, original: error });
  }
);

export default api;
