# Tasks: App Shell — Routing & Providers

**Mission**: `app-shell-routing-providers-01KWMJVH`
**Target branch**: `spec/app-shell-routing-providers`
**Generated**: 2026-07-03
**Source**: [plan.md](./plan.md) · [spec.md](./spec.md) · [data-model.md](./data-model.md) · [research.md](./research.md)

---

## Codebase Verified Facts (supersede planning assumptions)

These were confirmed against the actual repository on 2026-07-03 and refine earlier planning notes:

- **`src/app/index.ts` exists but is empty** (0 bytes). Ready to populate; do not recreate the directory.
- **`src/App.tsx` already renders `<Routes>`** and **`src/main.tsx` already wraps `<BrowserRouter>`**. WP07 must **modify** `src/App.tsx`, not introduce a second `BrowserRouter`.
- **`src/pages/App.tsx` is the demo entry** to delete. It is **not** exported from `pages/index.ts`, so deletion is safe and touches no public page boundary.
- **Repository singletons**: `zustandCartRepository` (lower-case `z`) at `@/entities/cart/api/zustand-cart-repository`; `MockInventoryRepository` at `@/entities/product`; `MockCouponRepository` at `@/entities/coupon`. All are module singletons; never re-instantiate.
- **Reactive cart hook**: `useCart()` at `@/entities/cart/api/cart-store`. Subscribe to this for the badge and the Cart container.
- **`Coupon` discount API**: `coupon.calculateDiscount(subtotalMoney: Money, now: Date, eventBus?) → Money`. Resolves the open detail in data-model.md (do **not** look for `amountCents`). Coupon mode is `flat` or `percentage`; the helper already caps and clamps.
- **`HomePage` is a no-props pure component** that renders `ProductCard` internally. C-004 forbids changing its boundary. WP05's HomeContainer therefore composes `ProductCard` directly with `onAddToCart` wired, and does **not** modify `home-page.tsx`.
- **Use-case signatures** (all async, all take the injected deps):
  - `AddToCart(skuId, quantity, cartRepo, stockRepo, eventBus)` → `AddToCartResult`
  - `ChangeCartItemQuantity(skuId, newQuantity, cartRepo, stockRepo, eventBus)` → `ChangeCartItemQuantityResult`
  - `RemoveFromCart(skuId, cartRepo, eventBus)` → `RemoveFromCartResult`
  - `ApplyCoupon(code, cartRepo, couponRepo, eventBus)` → `ApplyCouponResult`
  - `RemoveCoupon(cartRepo, eventBus)` → `RemoveCouponResult`
  - `InitiateCheckout(cartRepo, stockRepo, eventBus)` → `InitiateCheckoutResult`
- **`CheckoutInitiated`** event is defined in `@/features/checkout` (`{ eventType: 'CheckoutInitiated', cartId, userId, items, subtotal, timestamp }`).
- **`StockConflictModal`** props: `{ open: boolean, conflicts: StockConflict[], onAcknowledge: () => void }`. `StockConflict` is `{ skuId, productName, requestedQuantity, availableQuantity, imageUrl? }`.
- **`Modal`** primitive at `@/shared/ui/modal` with `ModalProps { open, onClose, title, children }`.

---

## Subtask Index

| ID   | Description                                                                 | WP   | Parallel |
| ---- | --------------------------------------------------------------------------- | ---- | -------- |
| T001 | Create `AppDeps` type + `AppDepsContext` + `useAppDeps` hook                | WP01 | [P]      |
| T002 | Create `AppProviders` component (`useRef(new EventBus())`, singletons)      | WP01 | —        |
| T003 | Export `AppProviders` from `src/app/index.ts`                               | WP01 | —        |
| T004 | Add optional `onAddToCart?: () => void` to `ProductCardProps`               | WP02 | [P]      |
| T005 | Render Add-to-cart `Button` when `onAddToCart` present (no layout shift)    | WP02 | —        |
| T006 | Update `ProductCard.stories.tsx` with an "Add to cart" story                | WP02 | —        |
| T007 | Create `CartIcon` bound to `getUniqueItemCount(useCart())`                  | WP03 | [P]      |
| T008 | Create `AppLayout` (header nav Home/Cart + `<CartIcon />` + `<Outlet />`)   | WP03 | —        |
| T009 | Create `AppRoutes` (`/` → HomeContainer, `/cart` → CartContainer, `*` → `/`)| WP03 | —        |
| T010 | Create `CheckoutSuccessModal` wrapping `Modal`                              | WP04 | [P]      |
| T011 | Derive `CartListItem[]` from `useCart()` + `productsData` via `Money`       | WP04 | —        |
| T012 | Derive order summary (subtotal/discount/shipping/total) via `Money`         | WP04 | —        |
| T013 | Wire cart callbacks to use cases (inc/dec/remove/coupon/checkout)           | WP04 | —        |
| T014 | Handle `InitiateCheckout` outcomes (success/conflict/no-op)                 | WP04 | —        |
| T015 | Create `HomeContainer` rendering `ProductCard` grid with `onAddToCart`      | WP05 | [P]      |
| T016 | Wire `onAddToCart` to `AddToCart` use case; handle out-of-stock             | WP05 | —        |
| T017 | Create `CheckoutSubscription` (reserve + confirmDepletion + save)           | WP06 | [P]      |
| T018 | Create `DiagnosticsSubscription` (logging-only cart-event handler)          | WP06 | [P]      |
| T019 | Create `<SubscriptionsRoot>` mounting both subscriptions                    | WP06 | —        |
| T020 | Wire `AppShell` = `<AppProviders><SubscriptionsRoot><AppRoutes /></...>`    | WP07 | —        |
| T021 | Modify `src/App.tsx` to render `<AppShell />` (preserve `<BrowserRouter>`)  | WP07 | —        |
| T022 | Delete `src/pages/App.tsx` (demo) and update imports                        | WP07 | —        |
| T023 | Verify all gates (`lint`, `lint:arch`, `build`, `test:unit`) exit 0         | WP07 | —        |

---

## Dependency Graph

```
WP01 (Composition Root)   ← foundation; every consumer needs useAppDeps
 ├── WP02 (ProductCard)   ← independent of WP01 (entity-layer change)
 ├── WP03 (App UI Chrome) ← independent of WP01 (pure layout/routes)
 ├── WP04 (Cart Container) ← needs WP01 (deps) + WP02 (success modal not required)
 ├── WP05 (Home Container) ← needs WP01 (deps) + WP02 (onAddToCart prop)
 └── WP06 (Subscriptions) ← needs WP01 (deps)

WP07 (App Shell Assembly) ← needs WP01..WP06 all merged
```

**Parallelization**:
- **Lane A** (foundation): WP01
- **Lane B** (independent leaves, can run concurrently after WP01 lands): WP02, WP03, WP06
- **Lane C** (containers, depend on WP02 + WP01): WP04, WP05
- **Lane D** (final integration): WP07 (after everything else merges)

---

## Work Packages

### WP01 — Composition Root (Providers & DI)

**Goal**: Create the dependency-injection spine that constructs (once) and exposes a shared `EventBus` plus the three repository singletons via React Context.
**Priority**: P0 — foundational. Every other WP that consumes `useAppDeps` depends on this.
**Independent Test**: A component rendered inside `<AppProviders>` can call `useAppDeps()` and read back the same `eventBus`, `cartRepo`, `stockRepo`, `couponRepo` across re-renders (single instance — C-002 / NFR-007).
**Relevant requirements**: FR-001, C-002, NFR-007.
**Estimated prompt size**: ~250 lines.

Included subtasks:
- [ ] T001 Create `AppDeps` type + `AppDepsContext` + `useAppDeps` hook (WP01)
- [ ] T002 Create `AppProviders` component (`useRef(new EventBus())`, singletons) (WP01)
- [ ] T003 Export `AppProviders` from `src/app/index.ts` (WP01)

Dependencies: none.
Owned files: `src/app/providers/**`, `src/app/index.ts`.

---

### WP02 — `ProductCard.onAddToCart` (entity UI refinement)

**Goal**: Add an optional, backward-compatible `onAddToCart?: () => void` to `ProductCardProps`; render an Add-to-cart `Button` when present, with no visual shift when absent.
**Priority**: P1 — unblocks WP05 (Home container).
**Independent Test**: Existing `ProductCard` stories still render identically (no `onAddToCart`); a new "Add to cart" story renders a Button that fires the callback on click.
**Relevant requirements**: FR-005, FR-011, C-004.
**Estimated prompt size**: ~230 lines.

Included subtasks:
- [ ] T004 Add optional `onAddToCart?: () => void` to `ProductCardProps` (WP02)
- [ ] T005 Render Add-to-cart `Button` when `onAddToCart` present (no layout shift) (WP02)
- [ ] T006 Update `ProductCard.stories.tsx` with an "Add to cart" story (WP02)

Dependencies: none (entity-layer change; orthogonal to WP01).
Owned files: `src/entities/product/ui/ProductCard/**`.

---

### WP03 — App UI Chrome (Header, CartIcon, Routes)

**Goal**: Build the persistent header (Home/Cart navigation + reactive cart-icon badge) and the route table that maps `/`, `/cart`, and unknown paths.
**Priority**: P1 — provides the chrome every page lives inside.
**Independent Test**: Navigating to `/` renders Home inside the layout; `/cart` renders Cart inside the layout; the badge reflects `getUniqueItemCount(cart)`; an unknown path redirects to `/`.
**Relevant requirements**: FR-002, FR-003, FR-004, NFR-001, NFR-003.
**Estimated prompt size**: ~330 lines.

Included subtasks:
- [ ] T007 Create `CartIcon` bound to `getUniqueItemCount(useCart())` (WP03)
- [ ] T008 Create `AppLayout` (header nav Home/Cart + `<CartIcon />` + `<Outlet />`) (WP03)
- [ ] T009 Create `AppRoutes` (`/` → HomeContainer, `/cart` → CartContainer, `*` → `/`) (WP03)

Dependencies: none directly (layout does not read `useAppDeps`; routed containers do, but they are passed as element references, not invoked at layout build time).
Owned files: `src/app/ui/layout.tsx`, `src/app/ui/cart-icon.tsx`, `src/app/routing/routes.tsx`.

---

### WP04 — Cart Container

**Goal**: Bridge the live cart aggregate to the presentational `CartPage`. Derive all `CartListItem` and order-summary props via `Money`. Wire every callback to its use case. Handle the four checkout outcomes.
**Priority**: P1 — completes US-1 / US-3.
**Independent Test**: With one item in the cart, opening `/cart` shows the item with Money-formatted price, subtotal/shipping/total; incrementing fires `ChangeCartItemQuantity`; applying a coupon reflects discount; checkout success opens the modal and empties the cart; stock conflict opens `StockConflictModal`.
**Relevant requirements**: FR-006, FR-007, FR-010, FR-012, C-003, C-004.
**Estimated prompt size**: ~480 lines.

Included subtasks:
- [ ] T010 Create `CheckoutSuccessModal` wrapping `Modal` (WP04)
- [ ] T011 Derive `CartListItem[]` from `useCart()` + `productsData` via `Money` (WP04)
- [ ] T012 Derive order summary (subtotal/discount/shipping/total) via `Money` (WP04)
- [ ] T013 Wire cart callbacks to use cases (inc/dec/remove/coupon/checkout) (WP04)
- [ ] T014 Handle `InitiateCheckout` outcomes (success/conflict/no-op) (WP04)

Dependencies: WP01 (for `useAppDeps`).
Owned files: `src/app/containers/cart-container.tsx`, `src/app/ui/checkout-success-modal.tsx`.

---

### WP05 — Home Container

**Goal**: Compose a responsive `ProductCard` grid (matching `HomePage`) inside the app layer, wiring each card's `onAddToCart` to the `AddToCart` use case with proper out-of-stock handling.
**Priority**: P1 — completes US-1 add-to-cart path.
**Independent Test**: On `/`, clicking add-to-cart calls `AddToCart`; on success the badge increments; on `InsufficientStockError` the affected card disables its button (FR-011) and the badge is unchanged.
**Relevant requirements**: FR-005, FR-011, C-004.
**Estimated prompt size**: ~280 lines.

Included subtasks:
- [ ] T015 Create `HomeContainer` rendering `ProductCard` grid with `onAddToCart` (WP05)
- [ ] T016 Wire `onAddToCart` to `AddToCart` use case; handle out-of-stock (WP05)

Dependencies: WP01 (for `useAppDeps`), WP02 (for the `onAddToCart` prop).
Owned files: `src/app/containers/home-container.tsx`.

---

### WP06 — Event Subscriptions

**Goal**: Subscribe to `CheckoutInitiated` (business side-effect: reserve-then-confirm stock depletion per line item) and to all cart events (diagnostics-only logging).
**Priority**: P1 — fulfils the checkout side-effect requirement.
**Independent Test**: After a successful `InitiateCheckout`, the checkout subscription depletes stock for each line item; the diagnostics subscription logs every cart event to `console.debug`. Unmounting unsubscribes cleanly.
**Relevant requirements**: FR-008, FR-009, NFR-005.
**Estimated prompt size**: ~300 lines.

Included subtasks:
- [ ] T017 Create `CheckoutSubscription` (reserve + confirmDepletion + save) (WP06)
- [ ] T018 Create `DiagnosticsSubscription` (logging-only cart-event handler) (WP06)
- [ ] T019 Create `<SubscriptionsRoot>` mounting both subscriptions (WP06)

Dependencies: WP01 (for `useAppDeps`).
Owned files: `src/app/subscriptions/**`.

---

### WP07 — App Shell Assembly & Demo Removal

**Goal**: Assemble `AppShell`, route it through `src/App.tsx`, delete the demo `src/pages/App.tsx`, and verify every project quality gate.
**Priority**: P0 — the integration WP. Runs last.
**Independent Test**: `npm run dev` shows the header on `/`, the product grid with working add-to-cart, the cart badge, and `/cart` with the full flow; `npm run lint && npm run lint:arch && npm run build && npm run test:unit` all exit 0.
**Relevant requirements**: FR-001..FR-012 (integration), C-001, C-002, NFR-004, NFR-005, SC-005.
**Estimated prompt size**: ~260 lines.

Included subtasks:
- [ ] T020 Wire `AppShell` = `<AppProviders><SubscriptionsRoot><AppRoutes /></...>` (WP07)
- [ ] T021 Modify `src/App.tsx` to render `<AppShell />` (preserve `<BrowserRouter>`) (WP07)
- [ ] T022 Delete `src/pages/App.tsx` (demo) and update imports (WP07)
- [ ] T023 Verify all gates (`lint`, `lint:arch`, `build`, `test:unit`) exit 0 (WP07)

Dependencies: WP01, WP02, WP03, WP04, WP05, WP06.
Owned files: `src/app/index.ts` (final assembly export), `src/App.tsx`, `src/pages/App.tsx` (deletion).

---

## MVP Scope Recommendation

**WP01 + WP03 + WP07** delivers the minimal "app shell with header, routing, and chrome" — the structural skeleton. WP04 + WP05 + WP06 then deliver the value (working add → cart → checkout). WP02 is a small enabler that WP05 needs. For a first demonstrable slice, implement in dependency order: **WP01 → WP02 + WP03 + WP06 (parallel) → WP04 + WP05 → WP07**.
