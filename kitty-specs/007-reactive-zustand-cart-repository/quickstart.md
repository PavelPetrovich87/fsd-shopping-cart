# Quickstart: Reactive Zustand Cart Repository

## 1. Implement planned repository artifacts
- `src/entities/cart/api/cart-store.ts`
- `src/entities/cart/api/zustand-cart-repository.ts`
- `src/entities/cart/index.ts`
- Integration test file for T-009 save->get and reactive behavior checks

## 2. Verify functional behavior
- `getCart()` exposes selector/hook-style reactive cart reads.
- `saveCart(cart)` persists updated cart state into store.
- Save->get round-trip returns equivalent cart state.
- Sequential saves produce non-stale observable results.
- Empty-cart save path remains valid.

## 3. Verify non-functional outcomes
- Measure save-to-observable-update latency and confirm 95% <= 100 ms in local validation run.
- Execute integration tests twice and confirm 100% pass in both runs.

## 4. Run repository quality gates
- `npm run lint`
- `npm run lint:arch`
- `npm run build`

## 5. Confirm scope and architecture compliance
- Changes limited to T-009 artifacts and required test coverage.
- No UI/features/pages/app-shell modifications.
- Public API exposure remains through cart slice index entrypoint only.
