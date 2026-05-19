---
affected_files: []
cycle_number: 2
mission_slug: 024-entity-ui-cartrow-emptystate
reproduction_command:
reviewed_at: '2026-05-19T11:32:18Z'
reviewer_agent: unknown
verdict: rejected
wp_id: WP02
---

**Issue 1**: Import path for Button sidesteps the shared/ui public API, causing `npm run lint:arch` to fail with `fsd/no-public-api-sidestep`.
**How to fix**: Change `import { Button } from '@/shared/ui/shadcn/button'` to `import { Button } from '@/shared/ui'` in `src/entities/cart/ui/empty-state/empty-state.tsx`. The `shared/ui` public API already re-exports `Button` from `./shadcn/button` (see `src/shared/ui/index.ts`).
