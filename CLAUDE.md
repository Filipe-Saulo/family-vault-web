# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite); needs the API on https://localhost:7072
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build
npm test           # Vitest (jsdom + Testing Library), single run
npm run test:watch # Vitest in watch mode
```

Tests use Vitest + jsdom + Testing Library (`@testing-library/react`, `user-event`, `jest-dom`), configured in `vite.config.ts` (`test` block, setup in `src/test/setup.ts`). Test files live next to the code they cover as `*.test.ts(x)`.

## Architecture

**family-vault-web** is a React 19 + TypeScript + Vite SPA for managing financial transactions, users, and categories, plus a read-only dashboard. The UI language is Portuguese (PT-BR). Every route (`/dashboard`, `/transactions`, `/users`, `/category`) is wrapped in `ProtectedRoute`, which requires Administrator role — there is no non-admin authenticated state.

### Key data flow

```
Page (CRUD state + filters)
  └─ React Query (server state)
       └─ Service (typed Axios wrapper)
            └─ api.ts (Axios instance with JWT interceptors)
```

- `src/api.ts` — Axios instance that attaches the JWT Bearer token on every request. On a **401** (except `/web/login`, `/web/refreshtoken`, `/logout`) it renews through `/web/refreshtoken` with a separate `plainAxios` instance, sending the expired token in `Authorization` and the refresh token via the HttpOnly cookie. Only **one** refresh is ever in flight: concurrent 401s wait for the same promise and retry with the new token (the API revokes every session if a refresh token is reused, so never refresh twice). A 403 means missing permission and never triggers a refresh. The refresh is also serialized across tabs with `navigator.locks` (`family-vault-refresh`): inside the lock the token is re-read from `localStorage` and, if another tab already renewed it, that token is used without calling the API (fallback without `navigator.locks`: per-tab promise only). The callback registered with `setOnSessionExpired` (the `AuthProvider`'s `endSession`) runs once, and only when the refresh answers 4xx; network errors, timeouts and 5xx just reject the waiting requests and keep the session.
- `src/contexts/AuthContext.tsx` — Auth state via `useReducer` with a **lazy, synchronous** init from `localStorage` (`readAdminSession` in `src/lib/jwt.ts`), so the first render already knows the session and a page reload keeps the current route. An Administrator token counts as a session even if expired — the first 401 renews it or ends the session. `endSession()` is the single exit path (logout button, failed refresh, non-admin login): calls `/logout` (errors ignored), removes the token, `queryClient.clear()`, and navigates to `/login`.
- `src/routes/ProtectedRoute.tsx` — Reads only the auth context and redirects to `/login` when there is no admin session. JWT decoding (base64url, role claim as string or array) and `isAdmin` live only in `src/lib/jwt.ts`.
- `src/contexts/AuthRedirector.tsx` — Root `/` redirect: authenticated → `/dashboard`, unauthenticated → `/login`.
- `src/components/AppShell.tsx` — Shared page chrome (nav/layout) wrapping every authenticated page.

### Folder conventions

| Path | Purpose |
|---|---|
| `src/services/` | API calls, one subfolder per resource (`transactions/`, `users/`, etc.) |
| `src/types/` | TypeScript interfaces; `IBaseResponse<T>` and `IPagedResult<T>` are the standard API shapes |
| `src/schemas/` | Zod validation schemas used with react-hook-form |
| `src/components/<Feature>/` | `<Feature>Form.tsx` + `<Feature>List.tsx` per resource |
| `src/components/ui/` | shadcn/ui primitives; `common/` for shared layout pieces (PageHeader, FilterPanel, Pagination, EmptyState, etc.) |
| `src/hooks/` | `use-crud-mutations.ts` (create/update/delete + toasts + invalidation shared by the CRUD pages) |
| `src/Pages/` | One file per route; owns filter state, pagination, and React Query calls |
| `src/lib/` | `utils.ts` (cn helper), `api-error.ts` (error extraction: reads `message` only, the API joins everything there), `query-keys.ts` (`queryKeys` factory, the only place query keys are written), `not-admin-error.ts` (`NotAdminError`, login without Administrator role; checked with `instanceof`), `react-query-client.ts` |

### CRUD page pattern

Every resource page (`Transactions.tsx`, `Users.tsx`, `Category.tsx`) follows the same shape:
1. Local state: `showForm`, `filters`, `searchTerm`, `pageNumber`
2. `useQuery` for the paginated list
3. `useCrudMutations` (`src/hooks/`) for create/update/delete: success/error toasts and `invalidateQueries` come from the hook. Transaction and category mutations also invalidate `dashboard-summary`; editing a category also invalidates transactions. Deleting the last item of a page goes back one page. `deletingId` (from `deleteMutation.variables`) tells the list which row shows the spinner
4. Renders `<PageHeader>`, optional `<FilterPanel>`, `<FeatureList>`, `<Pagination>`, and `<FeatureForm>` (shown/hidden via `showForm`)

`Dashboard.tsx` is the exception: it's read-only (a single `useQuery` against `dashboardService.getSummary`, date-range filters only, no form/mutations).

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.*` file). Theme tokens are CSS variables in `src/index.css` using OKLch colors with `next-themes` for dark mode. Use `cn()` from `@/lib/utils` to merge classes.

### Forms

All forms use `react-hook-form` with `zodResolver`. Schemas live in `src/schemas/`. Validation mode is `onChange`.

### Path alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Environment variables

Defined in `.env`. `VITE_API_URL=/api` is same-origin: the Vite dev server proxies `/api` to `VITE_API_PROXY_TARGET` (default `https://localhost:7072`, `secure: false` for the self-signed cert; read with `loadEnv` in `vite.config.ts`, not exposed to the client). This is required because the API's `refreshToken` cookie is `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/api` — first-party only. All others exposed via `import.meta.env.VITE_*`: `VITE_API_URL` (backend base URL) and `VITE_BASE_PATH_NAME` (redirect target on auth failure/logout). `.env` is versioned (localhost + proxy only); `.env.example` mirrors it; `.env.local*` is gitignored for overrides.

### Code style (enforced by ESLint)

- No semicolons, single quotes, 4-space indent, trailing commas, 80-char print width (Prettier via `eslint-plugin-prettier`).
- Import order is auto-sorted and enforced (`simple-import-sort`) — don't hand-order imports.
- Unused imports/vars are flagged (`unused-imports`); prefix intentionally-unused args/vars with `_`.
