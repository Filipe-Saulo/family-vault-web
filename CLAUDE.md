# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
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

- `src/api.ts` — Axios instance that attaches the JWT Bearer token on every request. On a **401** (except `/web/login`, `/web/refreshtoken`, `/logout`) it renews through `/web/refreshtoken` with a separate `plainAxios` instance, sending the expired token in `Authorization` and the refresh token via the HttpOnly cookie. Only **one** refresh is ever in flight: concurrent 401s wait for the same promise and retry with the new token (the API revokes every session if a refresh token is reused, so never refresh twice). A 403 means missing permission and never triggers a refresh. If the refresh fails, the callback registered with `setOnSessionExpired` (the `AuthProvider`'s `endSession`) runs once and the waiting requests are rejected.
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
| `src/components/ui/` | shadcn/ui primitives; `common/` for shared layout pieces (PageHeader, EmptyState, etc.) |
| `src/Pages/` | One file per route; owns filter state, pagination, and React Query calls |
| `src/lib/` | `utils.ts` (cn helper), `api-error.ts` (error extraction), `react-query-client.ts` |

### CRUD page pattern

Every resource page (`Transactions.tsx`, `Users.tsx`, `Category.tsx`) follows the same shape:
1. Local state: `showForm`, `filters`, `searchTerm`, `pageNumber`
2. `useQuery` for the paginated list
3. `useMutation` for create and delete, each calling `queryClient.invalidateQueries` on success and `sonner` toast on error
4. Renders `<PageHeader>`, optional `<FilterPanel>`, `<FeatureList>`, and `<FeatureForm>` (shown/hidden via `showForm`)

`Dashboard.tsx` is the exception: it's read-only (a single `useQuery` against `dashboardService.getSummary`, date-range filters only, no form/mutations).

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.*` file). Theme tokens are CSS variables in `src/index.css` using OKLch colors with `next-themes` for dark mode. Use `cn()` from `@/lib/utils` to merge classes.

### Forms

All forms use `react-hook-form` with `zodResolver`. Schemas live in `src/schemas/`. Validation mode is `onChange`.

### Path alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Environment variables

Defined in `.env`. All exposed via `import.meta.env.VITE_*`: `VITE_API_URL` (backend base URL), `VITE_ASSET_URL`, `VITE_BASE_PATH_NAME` (redirect target on auth failure/logout), `VITE_APP_ENV`, `VITE_DEBUG`.

### Code style (enforced by ESLint)

- No semicolons, single quotes, 4-space indent, trailing commas, 80-char print width (Prettier via `eslint-plugin-prettier`).
- Import order is auto-sorted and enforced (`simple-import-sort`) — don't hand-order imports.
- Unused imports/vars are flagged (`unused-imports`); prefix intentionally-unused args/vars with `_`.
