import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Sun, Moon, Menu, X, Home, Shield, PlusCircle, LogIn, LogOut, UserPlus } from 'lucide-react';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.navBg};
  backdrop-filter: blur(12px);
  box-shadow: ${({ theme }) => theme.shadows.nav};
`;

const NavInner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth.nav};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navText};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { color: ${({ theme }) => theme.colors.navText}; opacity: 0.9; }
`;

const LogoIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
  border-radius: 0.25rem;
  display: block;
`;

const NavLinks = styled.div<{ $open?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    display: ${({ $open }) => $open ? 'flex' : 'none'};
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.navBg};
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.xs};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const NavLinkItem = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.navTextMuted};
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
  &:hover {
    color: ${({ theme }) => theme.colors.navText};
    background: ${({ theme }) => theme.colors.navHover};
  }
`;

const LogoutButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.navTextMuted};
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.default};
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
  &:hover {
    color: ${({ theme }) => theme.colors.navText};
    background: ${({ theme }) => theme.colors.navHover};
  }
`;

const IconButton = styled.button`
  background: ${({ theme }) => theme.colors.navHover};
  border: none;
  color: ${({ theme }) => theme.colors.navText};
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.25); }
`;

const Hamburger = styled(IconButton)`
  display: none;
  @media (max-width: 768px) { display: flex; }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Navbar: React.FC = () => {
  const { isAuthenticated, isTeacher, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <Nav role="navigation" aria-label="Navegação principal">
      <NavInner>
        <Logo to="/">
          <LogoIcon src="/favicon.png" alt="" aria-hidden="true" />
          SystemConnect
        </Logo>

        <NavLinks $open={menuOpen}>
          <NavLinkItem to="/" onClick={() => setMenuOpen(false)}>
            <Home size={16} /> Home
          </NavLinkItem>
          {isAuthenticated && isTeacher && (
            <>
              <NavLinkItem to="/admin" onClick={() => setMenuOpen(false)}>
                <Shield size={16} /> Gerenciar Posts
              </NavLinkItem>
              <NavLinkItem to="/posts/new" onClick={() => setMenuOpen(false)}>
                <PlusCircle size={16} /> Novo Post
              </NavLinkItem>
              <NavLinkItem to="/register" onClick={() => setMenuOpen(false)}>
                <UserPlus size={16} /> Criar Conta
              </NavLinkItem>
            </>
          )}
          {!isAuthenticated ? (
            <NavLinkItem to="/login" onClick={() => setMenuOpen(false)}>
              <LogIn size={16} /> Login
            </NavLinkItem>
          ) : (
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} /> Sair
            </LogoutButton>
          )}
        </NavLinks>

        <RightGroup>
          <IconButton onClick={toggleTheme} aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
          <Hamburger onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Hamburger>
        </RightGroup>
      </NavInner>
    </Nav>
  );
};

export default Navbar;
