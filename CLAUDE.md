# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build
```

There is no test suite configured.

## Architecture

**family-vault-web** is a React 19 + TypeScript + Vite SPA for managing financial transactions, users, and categories. The UI language is Portuguese (PT-BR). All routes behind `/transactions`, `/users`, and `/category` require Administrator role.

### Key data flow

```
Page (CRUD state + filters)
  └─ React Query (server state)
       └─ Service (typed Axios wrapper)
            └─ api.ts (Axios instance with JWT interceptors)
```

- `src/api.ts` — Axios instance that attaches the JWT Bearer token on every request. On a 403 response it calls `/api/refreshtoken` with a separate `plainAxios` instance (to avoid an infinite loop), stores the new token, and retries the original request.
- `src/contexts/AuthContext.tsx` — Auth state via `useReducer`. On mount, decodes the stored JWT to check expiry and role claim (`http://schemas.microsoft.com/ws/2008/06/identity/claims/role` must equal `"Administrator"`). Provides `login()` and `logout()`.
- `src/routes/ProtectedRoute.tsx` — Redirects unauthenticated/non-admin users to `/login`.
- `src/contexts/AuthRedirector.tsx` — Root `/` redirect: authenticated → `/transactions`, unauthenticated → `/login`.

### Folder conventions

| Path | Purpose |
|---|---|
| `src/services/` | API calls, one subfolder per resource (`transactions/`, `users/`, etc.) |
| `src/types/` | TypeScript interfaces; `IBaseResponse<T>` and `IPagedResult<T>` are the standard API shapes |
| `src/schemas/` | Zod validation schemas used with react-hook-form |
| `src/components/<Feature>/` | `<Feature>Form.tsx` + `<Feature>List.tsx` per resource |
| `src/components/ui/` | shadcn/ui primitives; `common/` for shared layout pieces (PageHeader, EmptyState, etc.) |
| `src/Pages/` | One file per route; owns filter state, pagination, and React Query calls |
| `src/lib/` | `utils.ts` (cn helper), `api-error.ts` (error extraction), `react-query-client.ts` |

### CRUD page pattern

Every resource page (`Transactions.tsx`, `Users.tsx`, `Category.tsx`) follows the same shape:
1. Local state: `showForm`, `filters`, `searchTerm`, `pageNumber`
2. `useQuery` for the paginated list
3. `useMutation` for create and delete, each calling `queryClient.invalidateQueries` on success and `sonner` toast on error
4. Renders `<PageHeader>`, optional `<FilterPanel>`, `<FeatureList>`, and `<FeatureForm>` (shown/hidden via `showForm`)

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.*` file). Theme tokens are CSS variables in `src/index.css` using OKLch colors with `next-themes` for dark mode. Use `cn()` from `@/lib/utils` to merge classes.

### Forms

All forms use `react-hook-form` with `zodResolver`. Schemas live in `src/schemas/`. Validation mode is `onChange`.

### Path alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Environment variables

Defined in `.env`. All exposed via `import.meta.env.VITE_*`. Key variable: `VITE_API_URL` (backend base URL).
