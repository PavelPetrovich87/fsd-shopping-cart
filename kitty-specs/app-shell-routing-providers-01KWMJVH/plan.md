# Implementation Plan: App Shell — Routing & Providers

**Branch**: `spec/app-shell-routing-providers` | **Date**: 2026-07-03 | **Spec**: [spec.md](./spec.md)
**Mission**: `app-shell-routing-providers-01KWMJVH`
**Input**: Feature specification from `/kitty-specs/app-shell-routing-providers-01KWMJVH/spec.md`

## Summary

Replace the demo entry point (`src/pages/App.tsx` with `useState` routing, hardcoded items, string-parsing of prices) with a real `app/` layer composition root. Add React Context-based dependency injection for one shared `EventBus` and the three repository adapter singletons; `react-router-dom` v7 routing between Home (`/`) and Cart (`/cart`); a global header with a reactive `CartIcon` badge; container components that derive `CartPage` props from the live cart via `Money` and wire every callback to its use case; an event subscription that turns `CheckoutInitiated` into reserve-then-confirm stock depletion; and a `Modal`-based "Order placed" confirmation. Refine `ProductCard` with an optional `onAddToCart` callback (entity-UI, backward-compatible). No new dependencies, no new design tokens.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: `react@19`, `react-router-dom@^7.14.1` (routing), `zustand` (cart store, integrated via T-009), Tailwind CSS v4 (existing tokens)
**Storage**: In-memory only (zustand store + mock fixture maps). No persistence; browser refresh returns cart to empty.
**Testing**: Vitest unit tests (`npm run test:unit`); existing 181-test suite must keep passing. New tests for derivation logic (Money-based subtotal/total) and the checkout subscription handler.
**Target Platform**: Modern browsers (desktop/tablet/mobile, ≥375px viewport). Single-page client app, no SSR.
**Project Type**: Web (Vite 8 + React 19 SPA)
**Performance Goals**: Cart-icon badge updates within one render cycle (<100 ms after state change); route transitions perceived as instantaneous (<200 ms); first-contentful under 2 s.
**Constraints**: FSD layer isolation (app imports only from lower layers); single `EventBus` instance; no string parsing of prices; no new dependencies; no new design tokens; worktree-based implementation.
**Scale/Scope**: ~11 new files in `src/app/`, ~3 modified files, ~1 deleted file. No new domain logic, no new UI primitives, no new pages.

## Charter Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project charter at `.kittify/charter/charter.md` exists and contributes 14 directives (DIR-001…DIR-014). Charter context was loaded in `compact` mode for the `plan` action.

One diagnostic: charter references a `styleguide` template set that is unavailable (available sets: `documentation-default`, `plan-default`, `research-default`, `software-dev-default`). This is a pre-existing charter misconfiguration unrelated to this mission; it does not block planning. The mission uses `software-dev`.

No conflicts between the charter directives and the spec's FR/NFR/Constraints were identified. The mission adheres to FSD layer isolation, library/event-bus patterns, and TDD practices already established in the project. **Gate: PASS.**

## Project Structure

### Documentation (this mission)

```
kitty-specs/app-shell-routing-providers-01KWMJVH/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── tasks/               # Phase 2 output (/spec-kitty:tasks — not yet)
```

### Source Code (repository root)

```
src/app/                                  ← NEW (composition root)
├── index.ts                              # exports AppShell
├── providers/
│   ├── app-providers.tsx                 # creates EventBus (useRef), exposes useAppDeps()
│   └── app-deps.ts                       # context + useAppDeps hook + types
├── routing/
│   └── routes.tsx                        # <Routes> "/" → HomeContainer, "/cart" → CartContainer, "*" → redirect
├── containers/
│   ├── cart-container.tsx                # reads useCart(), derives CartPage props via Money, wires use cases
│   └── home-container.tsx                # wires ProductCard.onAddToCart → AddToCart use case
├── ui/
│   ├── layout.tsx                        # header (Home/Cart nav) + CartIcon + <Outlet />
│   ├── cart-icon.tsx                     # badge bound to getUniqueItemCount(useCart())
│   └── checkout-success-modal.tsx        # wraps Modal primitive for "Order placed"
└── subscriptions/
    ├── checkout-subscription.tsx         # CheckoutInitiated → reserve + confirmDepletion + save
    └── diagnostics-subscription.tsx       # logs all cart events (no business logic)

src/App.tsx                               # MODIFIED — renders <AppShell /> inside <BrowserRouter>
src/entities/product/ui/ProductCard/...   # MODIFIED — gains optional onAddToCart?: () => void
src/pages/App.tsx                         # DELETED (demo replaced)
```

**Structure Decision**: Single-project web SPA following FSD. All new code lives under `src/app/`. The `app/` layer imports only from `pages/`, `widgets/`, `features/`, `entities/`, and `shared/`.

## Implementation Concern Map

### IC-01 — Composition Root (Providers & DI)

- **Purpose**: Create one shared `EventBus` and expose it + the three repository adapter singletons via React Context.
- **Relevant requirements**: FR-001, C-002, NFR-007
- **Affected surfaces**: `src/app/providers/app-providers.tsx`, `src/app/providers/app-deps.ts`, `src/app/index.ts`
- **Sequencing/depends-on**: none (foundational — every other concern consumes `useAppDeps`)
- **Risks**: `EventBus` lifetime must survive re-renders (use `useRef`, not `useState`); adapters are stateful module singletons (mock inventory map, zustand store) and must not be re-instantiated.

### IC-02 — Routing & Layout

- **Purpose**: Wire `react-router-dom` v7 routes for Home/Cart and a persistent header with nav + reactive `CartIcon`.
- **Relevant requirements**: FR-002, FR-003, FR-004, NFR-001, NFR-003
- **Affected surfaces**: `src/app/routing/routes.tsx`, `src/app/ui/layout.tsx`, `src/app/ui/cart-icon.tsx`, `src/App.tsx`
- **Sequencing/depends-on**: IC-01 (layout doesn't need providers, but the routed containers do)
- **Risks**: `CartIcon` must use `getUniqueItemCount(cart)` (distinct items), not `getItemCount` (sum of quantities) — see Assumption in spec. Unknown routes redirect to `/` (FR-002 default).

### IC-03 — Container Components (Cart & Home)

- **Purpose**: Bridge the live cart to the presentational `CartPage` (derive props via `Money`) and wire Home's `ProductCard.onAddToCart` to the `AddToCart` use case.
- **Relevant requirements**: FR-005, FR-006, FR-007, FR-011, FR-012, C-003, C-004
- **Affected surfaces**: `src/app/containers/cart-container.tsx`, `src/app/containers/home-container.tsx`, `src/entities/product/ui/ProductCard/ProductCard.tsx`, `src/entities/product/ui/ProductCard/ProductCard.stories.tsx`
- **Sequencing/depends-on**: IC-01 (for `useAppDeps`), IC-02 (for `useNavigate`)
- **Risks**: `CartListItem` derivation must join `cart.items` with `productsData` by `skuId` for `description`/`imageUrl`; `specs` is omitted (no fabrication — see research.md). `ProductCard` gains an *optional* `onAddToCart` — backward-compatible, but the card's layout must accommodate a button when the callback is present.

### IC-04 — Event Subscriptions

- **Purpose**: Subscribe to `CheckoutInitiated` (business side-effect: reserve-then-confirm stock depletion) and to all cart events (diagnostics logging).
- **Relevant requirements**: FR-008, FR-009, NFR-005
- **Affected surfaces**: `src/app/subscriptions/checkout-subscription.tsx`, `src/app/subscriptions/diagnostics-subscription.tsx`
- **Sequencing/depends-on**: IC-01 (for `useAppDeps`)
- **Risks**: `confirmDepletion({variant, orderId})` requires a prior `reserve({variant, orderId, quantity})` call — the subscription must perform both steps per line item (see research.md). `orderId` derived from `event.cartId`. Partial-reserve (insufficient stock) depletes only what was reserved. Subscriptions unsubscribe on unmount.

### IC-05 — Checkout UX Outcomes

- **Purpose**: Handle the four `InitiateCheckout` outcomes (success, empty_cart, invalid_state, stock_conflict).
- **Relevant requirements**: FR-010, FR-012
- **Affected surfaces**: `src/app/ui/checkout-success-modal.tsx`, `src/app/containers/cart-container.tsx`
- **Sequencing/depends-on**: IC-03 (the checkout handler lives in the container)
- **Risks**: Success → open `Modal` confirmation; the cart-clear happens inside `InitiateCheckout` (it transitions cart state). Stock conflict → open existing `StockConflictModal`. Empty/invalid → no-op (logged via diagnostics).

## Phase 0: Research

See [research.md](./research.md) for the four resolved research items (no `[NEEDS CLARIFICATION]` markers remain):
1. `confirmDepletion` signature — `{variant, orderId}`, depletes by reserved qty, requires prior `reserve()`.
2. Source of `description`/`imageUrl` — `productsData` fixture, joined by `skuId`. `specs` not available → omitted.
3. Cart coupon exposure — `cart.couponCode: string`; discount amount requires `couponRepo.findByCode(code)`.
4. Confirmation UI — no toast primitive; use existing `Modal` for "Order placed".

## Phase 1: Design & Contracts

See [data-model.md](./data-model.md) for:
- The new internal types (`AppDeps`, `useAppDeps`).
- The `CartListItem` derivation mapping (cart aggregate → presentational props).
- The order-summary derivation table (subtotal, discount, shipping, total).
- No `/contracts/` directory — this mission has no public API surface; all contracts are internal TypeScript types.

No `quickstart.md` generated — the mission composes existing primitives and use cases; the project README and existing component stories remain the quickstart.

## Gates

- ✅ Spec is substantive and committed (`e153eeb`).
- ✅ All four research items resolved (no `[NEEDS CLARIFICATION]` markers remain).
- ✅ Architecture adheres to FSD layer isolation (C-001): `app/` imports only from lower layers.
- ✅ Single `EventBus` instance via `useRef` (C-002).
- ✅ All currency derived via `Money.fromCents(...).format()` (C-003).
- ✅ Page contracts preserved — `CartPageProps` and `HomePage` boundary unchanged; only `ProductCard` (entity UI) gains an optional callback (C-004 intact).
- ✅ No new dependencies (C-005) — `react-router-dom` and `zustand` already present.
- ✅ Implementation will use worktree workflow (C-006) — `/spec-kitty:tasks` will allocate lanes.
- ✅ No new design tokens/primitives (C-007) — header/CartIcon/confirmation composed from existing primitives.
- ✅ Charter Check PASS (one pre-existing diagnostic noted, non-blocking).

## Branch Strategy Confirmation (2nd of 2)

- Current branch at plan start: `spec/app-shell-routing-providers`
- Intended planning/base branch: `spec/app-shell-routing-providers`
- Final merge target for completed changes: `spec/app-shell-routing-providers`
- `branch_matches_target`: **true** ✓

## ⛔ STOP — Plan Complete

This plan ends at Phase 1. **Do NOT proceed to task generation.** The user must explicitly run `/spec-kitty:tasks` to generate work packages.
