# Family Vault Web

Front-end SPA (Single Page Application) do sistema **Family Vault**, para gerenciar transações financeiras, usuários e categorias, com um dashboard de resumo financeiro. Interface 100% em PT-BR, acesso restrito a usuários com papel de Administrador.

---

## 🛠 Tecnologias

- **Base:** React 19, TypeScript, Vite
- **Roteamento:** React Router DOM
- **Data fetching:** Axios + TanStack React Query (cache, revalidação, mutations)
- **Formulários:** react-hook-form + zod + @hookform/resolvers
- **UI:** Tailwind CSS 4, shadcn/ui (Radix UI + class-variance-authority), lucide-react, next-themes (dark mode)
- **Notificações:** sonner
- **Autenticação:** JWT (Bearer token) via Axios, jwt-decode para leitura de claims no client
- **Qualidade:** ESLint (flat config) + Prettier

## ⚡ Comandos

```bash
npm run dev        # servidor de desenvolvimento (Vite)
npm run build      # type-check (tsc -b) + build de produção (vite build)
npm run lint       # ESLint
npm run preview    # preview do build de produção
```

Não há suite de testes automatizados configurada no momento.

## 📁 Estrutura do projeto

```
src/
├─ Pages/            # Uma página por rota; dona do estado de filtro/paginação e das chamadas React Query
├─ components/
│  ├─ <Feature>/      # <Feature>Form.tsx + <Feature>List.tsx por recurso (Transactions, Users, Category)
│  └─ ui/             # Primitivos shadcn/ui; ui/common/ para peças compartilhadas (PageHeader, EmptyState, etc.)
├─ services/          # Chamadas à API, uma subpasta por recurso
├─ schemas/           # Schemas zod usados com react-hook-form
├─ types/             # Interfaces TypeScript (IBaseResponse<T>, IPagedResult<T>, etc.)
├─ contexts/          # AuthContext (estado de autenticação) e AuthRedirector
├─ routes/            # ProtectedRoute
├─ lib/               # Utilitários (cn(), extração de erro de API, cliente do React Query)
├─ api.ts             # Instância Axios com interceptors de JWT (attach + refresh automático em 403)
├─ App.tsx            # Rotas da aplicação
└─ main.tsx           # Entry point (providers: ThemeProvider, QueryClientProvider, BrowserRouter)
```

Todo recurso CRUD (Transações, Usuários, Categorias) segue o mesmo padrão: a Page mantém estado local (`showForm`, filtros, paginação), usa `useQuery` para listar e `useMutation` para criar/editar/excluir, e renderiza `PageHeader` + `FilterPanel` + `<Feature>List` + `<Feature>Form`. O Dashboard é a exceção: só leitura, um único `useQuery` de resumo por período.

## 🔐 Autenticação e permissões

Login via JWT; o token carrega claims de papel (`Administrator`) e permissões granulares (ex: `ManageTransactions`, `ManageCategories`). O front decodifica essas claims uma única vez no `AuthContext` e usa isso para: (a) bloquear rotas administrativas via `ProtectedRoute`, e (b) esconder ações de editar/excluir que o usuário não tem permissão pra executar — puramente por UX, a validação real acontece no backend.

## 💻 Requisitos

- Node.js >= 20
- Uma instância da API do Family Vault rodando (URL configurada via `VITE_API_URL` no `.env`)

## ⚙️ Variáveis de ambiente

Defina um `.env` na raiz com:

```
VITE_API_URL=https://localhost:7072/api
VITE_ASSET_URL=
VITE_BASE_PATH_NAME=/
VITE_APP_ENV=development
VITE_DEBUG=false
```
