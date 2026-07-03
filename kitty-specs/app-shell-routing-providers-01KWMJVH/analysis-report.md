---
schema_version: 1
artifact_type: spec-kitty.analysis-report
command: /spec-kitty.analyze
mission_slug: app-shell-routing-providers-01KWMJVH
mission_id: 01KWMJVHXZ60DKKPZ8M77NFZC5
generated_at: '2026-07-03T19:03:05.062076+00:00'
analyzer_agent: claude
input_artifacts:
  spec.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/app-shell-routing-providers-01KWMJVH/spec.md
    sha256: 4e6b3e5281866bf580b2c1ab4f2c81b28c65b96c18183e13ab7d3572df6e3d91
  plan.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/app-shell-routing-providers-01KWMJVH/plan.md
    sha256: 0383a7bdf3478793029f1e0b801d20ea829638e7ff7f71409c63469107c1f135
  tasks.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/app-shell-routing-providers-01KWMJVH/tasks.md
    sha256: 0632157b725d70cd8681c871d4f20c76e645ec262dd089593c487185a59a4125
  charter:
    path: /Users/user/work/fsd-shopping-cart/.kittify/charter/charter.md
    sha256: f32ac3d17fdc264c47940a263643ab6eb42bdbdc54e3f7e9c91af316a4e6a14c
verdict: unknown
issue_counts:
  medium:
  low:
  high:
  critical:
  info:
findings: []
---

---
schema_version: 1
artifact_type: spec-kitty.analysis-report
command: /spec-kitty.analyze
mission_slug: app-shell-routing-providers-01KWMJVH
mission_id: 01KWMJVHXZ60DKKPZ8M77NFZC5
generated_at: '2026-07-03T18:50:00.000000+00:00'
analyzer_agent: claude
input_artifacts:
  spec.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/app-shell-routing-providers-01KWMJVH/spec.md
    sha256: 4e6b3e5281866bf580b2c1ab4f2c81b28c65b96c18183e13ab7d3572df6e3d91
  plan.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/app-shell-routing-providers-01KWMJVH/plan.md
    sha256: 0383a7bdf3478793029f1e0b801d20ea829638e7ff7f71409c63469107c1f135
  tasks.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/app-shell-routing-providers-01KWMJVH/tasks.md
    sha256: 0632157b725d70cd8681c871d4f20c76e645ec262dd089593c487185a59a4125
  charter:
    path: /Users/user/work/fsd-shopping-cart/.kittify/charter/charter.md
    sha256: f32ac3d17fdc264c47940a263643ab6eb42bdbdc54e3f7e9c91af316a4e6a14c
verdict: go
issue_counts:
  low: 0
  high: 0
  critical: 0
  info: 3
  medium: 0
findings:
  - severity: info
    code: DEPS_VERIFIED
    message: >-
      All WP dependency targets verified present at the paths the prompts reference
      (repos, use cases, primitives, helpers, entry points).
  - severity: info
    code: NAMING_DIVERGENCE_DOCUMENTED
    message: >-
      Cart use cases live in src/features/cart-actions (not src/features/cart) and
      coupon use cases in src/features/apply-coupon. WP prompts already reference
      the correct barrels; no edit required.
  - severity: info
    code: BUTTON Barrel_OK
    message: >-
      Button and Modal are re-exported from @/shared/ui; WP02/WP04 imports
      from the barrel resolve correctly.
---

# Pre-Implementation Analysis: App Shell — Routing & Providers

## Mission Overview
Wire the application together at the `app/` layer so pages no longer carry their own state. Replace the demo entry point (`src/pages/App.tsx`) with real providers (DI via React Context), routing (react-router-dom v7), a layout chrome with a reactive cart icon, and event subscriptions. Seven work packages span composition root, entity UI refinement, app chrome, two page-level containers, event subscriptions, and final assembly.

## Readiness Assessment

- **Specification**: Complete. 12 functional requirements (FR-001..FR-012), 7 NFRs, 7 constraints (C-001..C-007) are well-defined and mapped 1:1 to WP `requirement_refs` via `map-requirements` (12/12 functional mapped, 0 unmapped).
- **Plan**: Complete. 5 Implementation Concerns (IC-01..IC-05) covered; planning assumptions bridged to codebase reality in tasks.md "Codebase Verified Facts".
- **Tasks**: Finalized into 7 WPs (T001–T023), sized 176–466 lines each (within 200–700 ideal/max band), dependency graph parsed, 6 parallelization lanes computed.
- **Dependencies**: All external surfaces the WPs import from are confirmed present in the codebase (see verification matrix below).
- **Design Reference**: Penpot connection already verified during `/spec-kitty:specify`; this mission is primarily wiring (non-visual), with the only new visual primitive being the cart badge in WP03 (uses existing tokens `bg-error-600`).

## Dependency Verification Matrix

| WP  | External Surface                                  | Verified Path                                                    | Status |
|-----|---------------------------------------------------|------------------------------------------------------------------|--------|
| WP01 | `EventBus`                                        | `src/shared/lib/event-bus.ts`                                    | ✅ |
| WP01 | `zustandCartRepository`                           | `src/entities/cart/api/zustand-cart-repository.ts`               | ✅ |
| WP01 | `MockInventoryRepository` (via `@/entities/product`) | `src/entities/product/api/mock-inventory-repository.ts` + barrel re-export | ✅ |
| WP01 | `MockCouponRepository` (via `@/entities/coupon`)  | `src/entities/coupon/api/mock-coupon-repository.ts` + barrel re-export | ✅ |
| WP02 | `ProductCard` + `ProductCardProps`                | `src/entities/product/ui/ProductCard/ProductCard.tsx`            | ✅ |
| WP02 | `Button`                                          | `@/shared/ui` barrel → `./shadcn/button`                         | ✅ |
| WP03 | `useCart`, `getUniqueItemCount`                   | `src/entities/cart/api/cart-store.ts`, `src/entities/cart/model/cart.ts` | ✅ |
| WP03 | `Link`/`NavLink`/`Outlet` (react-router-dom v7)   | `package.json` dependency                                        | ✅ |
| WP04 | `AddToCart`, `ChangeCartItemQuantity`, `RemoveFromCart` | `@/features/cart-actions` barrel                          | ✅ |
| WP04 | `ApplyCoupon`, `RemoveCoupon`                     | `@/features/apply-coupon` barrel                                 | ✅ |
| WP04 | `InitiateCheckout`, `StockConflict`, `StockConflictModal` | `@/features/checkout` barrel                           | ✅ |
| WP04 | `Money.fromCents`, `Coupon.calculateDiscount`     | `src/shared/lib/money.ts`, `src/entities/coupon/model/coupon.ts` | ✅ |
| WP04 | `getSubtotalCents`, `Modal`                       | `src/entities/cart/model/cart.ts`, `@/shared/ui`                 | ✅ |
| WP05 | `AddToCart`, mock products, `ProductCard`         | `@/features/cart-actions`, `src/shared/api/fixtures/products.ts` | ✅ |
| WP06 | `CheckoutInitiated` event + DDD stock ops (`reserve`, `confirmDepletion`) | `@/features/checkout`, `@/entities/product` | ✅ |
| WP07 | `BrowserRouter` (already in `main.tsx`), `App.tsx`, `src/app/index.ts` | entry points present                       | ✅ |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WP07 final assembly lands before sibling lanes complete | High | Lane graph forces WP07 into parallel_group 2 (last); finalize-tasks collapsed WP01+WP07 into lane-a due to write-scope overlap on `src/app/index.ts`. |
| `src/pages/App.tsx` demo deletion leaves dangling imports | Medium | WP07 explicitly rewrites `src/App.tsx` to import `AppShell` from `@/app` and verifies all 4 quality gates + smoke test (US-1/US-2/US-3). |
| Reactive cart badge re-renders on every cart mutation | Low | `useCart()` selector already returns the derived `Cart` snapshot; badge reads `getUniqueItemCount(cart)` — no extra subscription needed. |
| `InitiateCheckout` 4 outcomes mishandled in WP04 | Medium | WP04 prompt enumerates all 4 `InitiateCheckoutResult` branches with explicit handling (success → modal, stock_conflict → enriched conflicts, empty/invalid → no-op). |
| Event subscription leaks (WP06) | Medium | All subscriptions return `Unsubscribe` from `useEffect` cleanup; fire-and-forget `.catch` on async stock depletion. |
| FSD C-001 violation (app layer importing sideways) | Low | WP03/WP04/WP05 import only from `@/entities/*`, `@/features/*`, `@/shared/*`; Steiger (`lint:arch`) enforces. |

## Implementation Strategy (Lane Order)

1. **Lane B (WP02)** & **Lane C (WP03)** — parallel, no deps. Entity UI refinement + app chrome scaffolding.
2. **Lane D (WP04)**, **Lane E (WP05)**, **Lane F (WP06)** — parallel, all depend on Lane A's `AppProviders`/`useAppDeps` contract (WP01). But WP01 is in Lane A group 2 — see note below.
3. **Lane A (WP01 then WP07)** — WP01 establishes the DI context that WP04/WP05/WP06 consume via `useAppDeps()`; WP07 assembles the shell last.

> **Lane note**: finalize-tasks placed WP01 in Lane A (parallel_group 2) alongside WP07 due to `src/app/index.ts` write-scope overlap. WP04/WP05/WP06 depend on WP01's `AppDeps` interface but only consume it via `useAppDeps()` at call sites — they can be implemented against the documented interface contract before WP01 lands, and WP01 must land before WP07 assembles. Recommended serial order for a single implementer: **WP01 → (WP02 ‖ WP03) → (WP04 ‖ WP05 ‖ WP06) → WP07**.

## Go/No-Go Decision

**GO** — All 12 FRs mapped, all dependency surfaces verified present, sizing within bounds, lane graph acyclic. No blockers. Ready to implement starting with WP01.
