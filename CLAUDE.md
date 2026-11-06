# SVAMS — CLAUDE.md

Instructions for Claude Code agents working on the SVAMS repository.

See also `AGENTS.md` for the project overview and tech stack.

---

## Working context

- Repository: `D:\PROJECTS\HCP\Police Seized Vehicle Auction`
- Built frontend (React 19 + Vite + Tailwind v4 + TypeScript 5.7) — no backend yet (mock-first)
- Docs: README.md, PRD.md, FRONTEND_DOC.md, RULES_AND_CONSTRAINTS.md, SETUP.md, AGENTS.md

---

## Before writing code

1. Read `RULES_AND_CONSTRAINTS.md` — mandatory rules are enforced in code review.
2. Read `AGENTS.md` — folder conventions and entry points.
3. Check `src/api/types.ts` before creating new types — reuse existing interfaces.
4. All API calls go through `src/api/service.ts` (mock/real swappable). No direct `fetch` in components.
5. New UI components → `src/shared/ui/` + export from `src/shared/ui/index.ts`.
6. New screens → `src/screens/` + route in `src/App.tsx` ROUTES + nav item in `AppShell.tsx`.
7. Use `useAuth()` for session/role; `hasPermission(role, action)` for RBAC.
8. Run `npx tsc --noEmit` and `npm run build` before considering a task done.

---

## Common patterns

### Screen component
```tsx
import { useState } from 'react';
import { Card, PageHeader, Button, Input } from '../shared/ui';
import { apiService } from '../api/service';
import { useAuth } from '../contexts/AuthContext';

export const MyScreen = () => {
  const { user, hasPermission } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiService.getVehicles();
      setData(res.data);
    } catch (e) {
      // error handling required (R-007)
    } finally {
      setLoading(false); // loading state required (R-008)
    }
  };

  return (
    <div>
      <PageHeader title="My Screen" subtitle="Description" />
      <Card padding="md">
        {loading ? <div>Loading…</div> : <Table columns={[]} data={data} />}
      </Card>
    </div>
  );
};
```

### Role guard in App.tsx
```tsx
{ path: '/auc-create-lot', element: <AUCCreateLot />, roles: ['AuctionCell'] },
```

### Icon usage
```tsx
import { SearchIcon, Button } from '../shared/ui';
// or aliases: import { Search } from '../shared/ui';
```

---

## Verification checklist

- [ ] `npx tsc --noEmit` — no errors in `src/`
- [ ] `npm run build` — production bundle succeeds
- [ ] `npm run format` — applied (oxfmt)
- [ ] New screen accessible by intended role only
- [ ] Loading states on all async operations
- [ ] Error handling on all async operations
- [ ] Mobile-responsive (`sm:`, `md:`, `lg:` classes)
- [ ] Docs updated (README/FRONTEND_DOC per RULES_AND_CONSTRAINTS section 9)

---

## Do NOT

- Use `any` type (R-002)
- Add raw `<button>` elements — use shared `Button` (R-012)
- Put UI components in `src/components/ui.tsx` — that file is legacy (use `src/shared/ui/`)
- Commit `.env` with secrets (S-006, V-001)
- Skip `npm run build` before commit (V-002)
- Leave `console.log` / `debugger` / commented code (V-005)
