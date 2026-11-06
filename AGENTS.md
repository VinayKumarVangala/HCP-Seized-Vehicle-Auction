# SVAMS — AGENTS.md

Project overview and guidance for AI agents working on the SVAMS codebase.

---

## 1. Project purpose

SVAMS (Seized Vehicle Auction Management System) is a multi-role, real-time web application for Telangana Police to manage the complete lifecycle of seized vehicles — from seizure entry through notice compliance, legal clearance, auction lot creation, live bidding, to sale confirmation and payment reconciliation.

**7 roles:** PS, SHO, Legal, AuctionCell, Finance, Admin, Bidder

---

## 2. Tech stack (do not deviate)

| Layer | Technology | Version | Constraint |
|-------|-----------|---------|------------|
| Framework | React | 19 | C-001: no downgrade |
| Build tool | Vite | 8 (6.x) | C-002: no Webpack |
| Language | TypeScript | 5.7 | C-004: strict mode |
| Styling | Tailwind CSS | v4 | C-003: v4 only |
| Icons | Inline SVG components | — | R-011: from `Icons.tsx` |
| Forms | Shared components (no library) | — | R-013: use `Field` wrapper |
| Routing | react-router-dom | 7+ | Role guards required |
| HTTP | Fetch API (via service layer) | — | R-020: no direct fetch in components |
| Real-time | WebSocket (native) | — | R-022: fallback polling |

---

## 3. Mandatory rules (RULES_AND_CONSTRAINTS.md)

- **R-001** TypeScript `strict: true` — no `any` (R-002)
- **R-003** Format with `oxfmt` before commit
- **R-004** Functional components + hooks only
- **R-005** Tailwind utility classes only; inline styles for dynamic values only
- **R-006** `export type` for type-only exports
- **R-007** All async ops need error handling
- **R-008** All async UI needs loading states
- **R-009** Shared UI components live in `src/shared/ui/`
- **R-010** Screens live in `src/screens/` or `src/features/`
- **R-011** Icons from `src/shared/ui/Icons.tsx`
- **R-012** Use shared `Button`, no raw `<button>`
- **R-013** Use shared `Field` for all form inputs
- **R-014** No prop drilling deeper than 3 levels
- **R-017** Mobile-responsive (`sm:`, `md:`, `lg:`)
- **R-019** Mock-first: features must work with `VITE_ENABLE_MOCK_API=true`
- **R-020** All API calls via `src/api/service.ts`
- **R-021** API responses match `src/api/types.ts` interfaces
- **R-022** WebSocket features need fallback polling

Security: S-001..S-011. RBAC: RBAC-001..RBAC-004. Real-time: RT-001..RT-005, NT-001..NT-003.

---

## 4. Folder conventions

```
src/api/          — types.ts, mockStore.ts, service.ts, websocket.ts, notifications.ts
src/components/   — AppShell.tsx (layout only)
src/contexts/     — AuthContext.tsx
src/routes/       — AppRoutes.tsx (role guards)
src/screens/      — one file per screen, named <Role><Screen>.tsx
src/shared/ui/    — Button, Inputs, DataDisplay, FormComponents, Icons + index.ts barrel
```

New component → `src/shared/ui/`. New screen → `src/screens/`. New route → add to `App.tsx` ROUTES + `AppRoutes.tsx` guard.

---

## 5. Key entry points

- `src/main.tsx` — React root
- `src/App.tsx` — route table (ROUTES array) + AuthProvider + AppShell
- `src/contexts/AuthContext.tsx` — `useAuth()` hook; `login`, `logout`, `hasPermission(role, action)`
- `src/nav.tsx` — `getMenuForRole(role)`, `NavProvider`
- `src/api/service.ts` — `apiService` singleton; mock/real via `VITE_ENABLE_MOCK_API`
- `src/api/mockStore.ts` — `mockStore` singleton (seed data)
- `src/api/websocket.ts` — `wsService` (connect/subscribe/send/disconnect)
- `src/api/notifications.ts` — `notificationService` (notifySeizureCreated, notifyBidPlaced, etc.)

---

## 6. Adding a new screen

1. Create `src/screens/RoleScreenName.tsx`
2. Add route to `ROUTES` array in `src/App.tsx` with `roles` allowed
3. Add nav item to `ROLE_MENU_ITEMS` in `src/components/AppShell.tsx` (and `NAV_ITEMS` in `src/nav.tsx`)
4. Import UI components from `src/shared/ui`
5. Run `npm run build` to verify type safety
6. Update `FRONTEND_DOC.md` screen catalog (R-007 documentation trigger)

---

## 7. Adding a new UI component

1. Create file in `src/shared/ui/` (e.g., `MyComponent.tsx`)
2. Export from `src/shared/ui/index.ts` barrel
3. Do NOT add to `src/components/ui.tsx` (legacy)
4. Document in `FRONTEND_DOC.md` (R-007)

---

## 8. Theme tokens (src/index.css)

- `--color-police-green: #145a43` — primary actions
- `--color-police-gold: #d4a017` — accents
- `--color-police-light: #f0fdf4` — backgrounds
- `--color-police-danger: #dc2626` — errors

Use `police-btn`, `police-input` CSS utilities where applicable.

---

## 9. Demo login flow

1. User lands on `/login`
2. Selects role from dropdown (any password works in mock)
3. `AuthContext.login()` → mockStore validates → token stored in localStorage
4. Redirect to role's default dashboard
5. Route guards (`RequireAuth`, `RouteGuard`) enforce role access

---

## 10. Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on :8443 |
| `npm run build` | `tsc && vite build` (type-check + bundle) |
| `npm run preview` | Preview production build |
| `npm run format` | oxfmt formatter |

---

## 11. Related docs

- `README.md` — complete project documentation
- `PRD.md` — product requirements
- `FRONTEND_DOC.md` — frontend technical reference
- `RULES_AND_CONSTRAINTS.md` — mandatory rules & standards
- `SETUP.md` — installation & setup
