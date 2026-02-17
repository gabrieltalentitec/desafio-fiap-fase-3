import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Post } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/Skeleton';
import { Search, RefreshCw, BookOpen } from 'lucide-react';
import Button from '../components/Button';

const Hero = styled.section`
  background: ${({ theme }) => theme.colors.heroBg};
  color: ${({ theme }) => theme.colors.heroText};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const HeroInner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth.list};
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 800;

  @media (max-width: 600px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchBox = styled.div`
  max-width: 500px;
  margin: 0 auto;
  position: relative;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  backdrop-filter: blur(8px);
  transition: all ${({ theme }) => theme.transitions.default};

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.15);
  }
`;

const Container = styled.main`
  max-width: ${({ theme }) => theme.maxWidth.list};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 2px dashed ${({ theme }) => theme.colors.borderLight};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.destructive};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.xl};
`;

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Debounce evita disparar uma requisição a cada tecla digitada.
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchPosts();
  }, [debouncedSearch]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Só usa endpoint de busca quando há texto; caso contrário carrega lista completa.
      const url = debouncedSearch.trim()
        ? `/posts/search?q=${encodeURIComponent(debouncedSearch.trim())}`
        : '/posts';
      const res = await api.get(url);
      const data = res.data.data || res.data;
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar posts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero>
        <HeroInner>
          <HeroTitle>SystemConnect</HeroTitle>
          <HeroSubtitle>
            Explore artigos e conteúdos exclusivos dos nossos professores
          </HeroSubtitle>
          <SearchBox>
            <SearchIcon><Search size={18} /></SearchIcon>
            <SearchInput
              placeholder="Buscar posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar posts"
            />
          </SearchBox>
        </HeroInner>
      </Hero>

      <Container>
        <SectionTitle>
          <BookOpen size={22} />
          {search ? 'Resultados da Busca' : 'Posts Recentes'}
        </SectionTitle>

        {loading ? (
          <Grid>
            {[1, 2, 3, 4, 5, 6].map((i) => <PostCardSkeleton key={i} />)}
          </Grid>
        ) : error ? (
          <ErrorState>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</p>
            <p>{error}</p>
            <Button variant="outline" onClick={fetchPosts} style={{ marginTop: '1rem' }}>
              <RefreshCw size={16} /> Tentar novamente
            </Button>
          </ErrorState>
        ) : posts.length === 0 ? (
          <EmptyState>
            <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</p>
            <p style={{ fontSize: '1.125rem' }}>{search ? 'Nenhum post encontrado para sua busca.' : 'Nenhum post publicado ainda.'}</p>
          </EmptyState>
        ) : (
          <Grid>
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Home;
