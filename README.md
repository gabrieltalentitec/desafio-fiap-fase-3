# SystemConnect

Plataforma web para publicação e leitura de posts, com autenticação, controle por perfil (`teacher` e `student`) e interface responsiva com tema claro/escuro.

## Visão geral

O projeto é um frontend React que consome uma API REST em `http://localhost:3000`.

Funcionalidades principais:
- listagem e busca de posts
- visualização de post completo
- autenticação com persistência em cookie
- criação de conta de professor
- criação, edição e exclusão de posts (perfil professor)
- área administrativa para gestão de posts
- feedback visual com skeletons, estados de erro/vazio e toasts

## Stack técnica

- React 18
- TypeScript
- Vite 5
- React Router DOM 6
- styled-components 6
- Axios
- Zod
- react-hot-toast
- Vitest + Testing Library

## Requisitos

- Node.js 18+
- npm 9+

## Como rodar localmente

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:8080`.

## Scripts

- `npm run dev`: inicia servidor de desenvolvimento
- `npm run build`: gera build de produção
- `npm run build:dev`: gera build em modo development
- `npm run preview`: serve o build localmente
- `npm run lint`: executa ESLint
- `npm test`: executa testes com Vitest
- `npm run test:watch`: executa testes em modo watch

## Estrutura do projeto

```txt
src/
  components/      # componentes reutilizáveis de UI e guardas de rota
  contexts/        # AuthContext e ThemeContext
  hooks/           # hooks customizados (ex: useDebounce)
  pages/           # páginas mapeadas por rota
  services/        # cliente HTTP e interceptors
  styles/          # tema, tipagem do tema e estilos globais
  test/            # setup e testes
  types/           # tipagens compartilhadas
```

Arquivos de configuração:
- `vite.config.ts`: configuração do Vite e alias `@ -> src`
- `vitest.config.ts`: ambiente de testes (`jsdom`) e setup global
- `eslint.config.js`: regras de lint para TS/React
- `tsconfig*.json`: configuração TypeScript por contexto

## Rotas da aplicação

- `/`: home com busca de posts
- `/posts/:id`: detalhe de post
- `/login`: autenticação
- `/register`: criação de conta de professor
- `/posts/new`: criar post (apenas professor)
- `/posts/:id/edit`: editar post (apenas professor)
- `/admin`: gestão de posts (apenas professor)
- `/not-found` e `*`: página de não encontrado

## Autenticação e autorização

- sessão salva em cookie (`auth_token`, `auth_user`) via `js-cookie`
- restauração automática de sessão ao carregar a aplicação
- `TeacherRoute` protege rotas exclusivas de professor
- interceptors do Axios com `Authorization: Bearer <token>` em todas as requisições autenticadas
- tratamento centralizado de erros HTTP
- `401`: remove sessão e redireciona para login
- `403`: bloqueio silencioso para tratamento no fluxo da tela

## Camada de API

Cliente HTTP em `src/services/api.ts`:
- `baseURL`: `http://localhost:3000`
- `Content-Type`: `application/json`
- suporte a payload no formato `{ success, message, data }` e fallback para resposta direta

Endpoints esperados no backend:
- `POST /auth/login`
- `POST /auth/register`
- `GET /posts`
- `GET /posts/search?q=...`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`

## Padrões de componentes e UI

Padrões adotados no código:
- estilo via `styled-components` com tokens do tema
- componentes compartilhados em `src/components`
- props tipadas com TypeScript
- variantes semânticas em botões (`primary`, `success`, `destructive`, etc.)
- formulários com validação por `zod`
- feedback de erro por campo usando componentes `Input` e `Textarea`
- modais de confirmação para ações destrutivas
- skeletons para estados de carregamento

Boas práticas recomendadas para evolução:
- evitar cores/tamanhos hardcoded fora de `src/styles/theme.ts`
- manter consistência de espaçamento usando tokens de tema
- preferir componentes reutilizáveis antes de criar novos padrões
- manter textos de erro e sucesso consistentes com toasts

## Tema e design system

- tema claro e escuro definidos em `src/styles/theme.ts`
- preferência de tema persistida em `localStorage` (`blog_theme`)
- estilos globais em `src/styles/GlobalStyles.ts`
- tipagem de tema em `src/styles/styled.d.ts`

## Testes

Ferramentas já configuradas:
- `Vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- ambiente `jsdom`

Como os testes funcionam hoje:
- arquivos de teste ficam próximos ao código (`*.test.ts` / `*.test.tsx`)
- setup global em `src/test/setup.ts` (inclui `jest-dom` e mock de `matchMedia`)
- o alias `@/` também funciona nos testes (configurado no `vitest.config.ts`)
- padrão recomendado: `describe` por módulo e `it` por cenário de negócio

Suíte atual implementada:
- `src/contexts/AuthContext.test.tsx`
- restauração de sessão por cookie
- limpeza de sessão inválida
- login persistindo token e usuário
- `src/components/RouteGuards.test.tsx`
- redirecionamentos de `PrivateRoute` e `TeacherRoute`
- acesso permitido quando perfil está correto
- `src/hooks/useDebounce.test.ts`
- atualização do valor somente após o delay

Comandos de execução:
- `npm test`: roda todos os testes uma vez
- `npm run test:watch`: roda em watch mode
- `npx vitest run src/contexts/AuthContext.test.tsx`: roda um arquivo específico
- `npx vitest --ui`: abre interface interativa local do Vitest (se quiser depurar cenários)

## Convenções de código

- TypeScript como padrão
- componentes e páginas em `PascalCase`
- hooks em `camelCase` com prefixo `use`
- alias de import `@/` para `src/`
- lint com ESLint (`npm run lint`)