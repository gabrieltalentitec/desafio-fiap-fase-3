# Tech Challenge FIAP - Fase 03

Frontend em React para a plataforma de blogging acadêmico desenvolvida no Tech Challenge. A aplicação permite leitura de posts para estudantes e gestão de conteúdo para professores, consumindo a API REST entregue na fase 02.

## Objetivo da fase

Esta entrega atende ao desafio da FIAP de construir a interface gráfica da aplicação de blogging com:

- listagem e busca de posts
- leitura de post completo
- autenticação de professores
- criação, edição e exclusão de postagens
- página administrativa
- responsividade
- documentação técnica no repositório

O backend utilizado por este frontend é o da fase 02.

## Integração com a API da fase 02

Este projeto foi preparado para dois cenários:

- Desenvolvimento local: basta subir a API da fase 02 localmente e configurar `VITE_API_BASE_URL` para ela.
- Produção: a aplicação consome a URL pública `https://desafio-fiap-fase-2.onrender.com/`.

Exemplo local:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Exemplo para build de produção:

```env
VITE_API_BASE_URL=https://desafio-fiap-fase-2.onrender.com/
```

## Stack

- React 18
- TypeScript
- Vite 5
- React Router DOM
- styled-components
- Axios
- Zod
- react-hot-toast
- Vitest
- Testing Library

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- API da fase 02 rodando localmente para desenvolvimento

## Setup inicial

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Garanta que a API da fase 02 esteja rodando localmente.

4. Inicie o frontend:

```bash
npm run dev
```

Aplicação disponível em `http://localhost:8080`.

## Variáveis de ambiente

A aplicação usa apenas uma variável obrigatória:

- `VITE_API_BASE_URL`: URL base da API REST

Arquivo de referência:

- `.env.example`

Valor atual de exemplo no repositório:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera o build de produção
- `npm run build:dev`: gera o build usando modo development
- `npm run preview`: publica localmente o build gerado
- `npm run lint`: executa o lint
- `npm test`: executa os testes
- `npm run test:watch`: executa os testes em modo watch

## Docker

O repositório possui `Dockerfile` para build e execução do frontend.

Build:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://desafio-fiap-fase-2.onrender.com/ \
  -t desafio-fiap-fase-3 .
```

Execução:

```bash
docker run --rm -p 8080:80 desafio-fiap-fase-3
```

## Funcionalidades implementadas

### Área pública

- listagem de posts na página inicial
- busca por palavras-chave
- leitura completa de posts
- tratamento de loading, erro e estado vazio

### Área autenticada

- login de professor
- persistência de sessão com cookies
- criação de post
- edição de post
- exclusão de post
- tela administrativa para gerenciamento das postagens

## Regras de acesso

- rotas de criação, edição e administração são protegidas
- apenas usuários autenticados com perfil `teacher` acessam essas telas
- o header `Authorization: Bearer <token>` é enviado automaticamente quando existe sessão
- respostas `401` limpam a sessão local e redirecionam para login

## Guia de uso

### Fluxo básico

1. Acesse a página inicial para visualizar e buscar posts.
2. Abra um post para ler o conteúdo completo.
3. Faça login como professor para liberar as áreas protegidas.
4. Use `/posts/new` para publicar conteúdo.
5. Use `/admin` para visualizar, editar e excluir postagens.

### Rotas da aplicação

- `/`: página inicial com listagem e busca
- `/posts/:id`: leitura de post
- `/login`: login
- `/register`: cadastro de professor
- `/posts/new`: criação de post
- `/posts/:id/edit`: edição de post
- `/admin`: administração
- `*`: página de não encontrado

## Arquitetura da aplicação

Estrutura principal:

```text
src/
  components/   componentes reutilizáveis de interface e guardas de rota
  contexts/     autenticação e tema
  hooks/        hooks customizados
  pages/        páginas mapeadas pelo React Router
  services/     cliente HTTP Axios e interceptadores
  styles/       tema, estilos globais e tipagens
  test/         setup de testes
  types/        contratos TypeScript compartilhados
```

### Decisões de implementação

- `React Router` controla a navegação da aplicação
- `Context API` gerencia autenticação e tema
- `styled-components` concentra a estilização e os tokens visuais
- `Axios` centraliza a comunicação com a API
- `Zod` valida formulários de login, cadastro e posts

## Endpoints esperados do backend

O frontend foi construído para consumir os endpoints da API da fase 02:

- `POST /auth/login`
- `POST /auth/register`
- `GET /posts`
- `GET /posts/search?q=...`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`

## Testes

O projeto possui cobertura inicial para regras importantes de comportamento:

- restauração de sessão e fluxo de autenticação
- proteção de rotas
- comportamento do hook `useDebounce`

Arquivos de teste presentes no repositório:

- `src/contexts/AuthContext.test.tsx`
- `src/components/RouteGuards.test.tsx`
- `src/hooks/useDebounce.test.ts`

Executar testes:

```bash
npm test
```

## Responsividade e UI

O projeto atende ao requisito de interface responsiva com:

- layout adaptado para desktop e mobile
- componentes reutilizáveis
- tema claro/escuro
- feedback visual com toasts e skeleton loaders
