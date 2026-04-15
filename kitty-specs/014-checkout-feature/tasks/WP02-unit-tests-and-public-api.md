---
work_package_id: WP02
title: Unit Tests & Public API
dependencies:
- WP01
requirement_refs:
- FR-014
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-15T10:02:31Z'
subtasks:
- T004
- T006
history:
- date: '2026-04-15T10:02:31Z'
  action: created
  note: Unit tests and public API for checkout feature
authoritative_surface: src/features/checkout/
execution_mode: code_change
owned_files:
- src/features/checkout/model/initiate-checkout.test.ts
- src/features/checkout/index.ts
tags: []
---

# WP02: Unit Tests & Public API

## Objective

Write comprehensive unit tests for the `InitiateCheckout` use case covering all scenarios, and expose the public API for the checkout feature slice.

## Context

### Feature Overview

The `InitiateCheckout` use case from WP01:
1. Validates cart state (must be `Active`)
2. Validates cart is not empty
3. Validates stock for ALL cart items
4. Transitions cart to `Checkout_Pending`
5. Publishes `CheckoutInitiated` event

### Result Types (from WP01)

```typescript
type InitiateCheckoutResult =
  | { success: true; cart: Cart }
  | { success: false; reason: 'empty_cart' }
  | { success: false; reason: 'invalid_state' }
  | { success: false; reason: 'stock_conflict'; conflicts: StockConflict[] };
```

### Repository Interfaces

```typescript
interface ICartRepository {
  getCart(): Promise<Cart>;
  saveCart(cart: Cart): Promise<void>;
}

interface IStockRepository {
  findBySku(skuId: string): Promise<ProductVariant | null>;
}

interface EventBus {
  publish<T>(event: T): Promise<void>;
  subscribe<T>(handler: (event: T) => void): () => void;
}
```

---

## Detailed Implementation Guidance

### Subtask T004: Write Unit Tests

**Purpose**: Validate all `InitiateCheckout` scenarios via comprehensive unit tests with mocked repositories.

**File**: `src/features/checkout/model/initiate-checkout.test.ts`

**Test Structure**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InitiateCheckout } from './initiate-checkout';
import { ICartRepository } from '@/entities/cart';
import { IStockRepository } from '@/entities/product';
import { EventBus } from '@/shared/lib/event-bus';
import { Cart, CartState } from '@/entities/cart';
import { ProductVariant } from '@/entities/product';
import { CheckoutInitiated } from './events';

const createMockCartRepo = (overrides = {}) => ({
  getCart: vi.fn().mockResolvedValue(createCart()),
  saveCart: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

const createMockStockRepo = (variants: ProductVariant[] = []) => ({
  findBySku: vi.fn().mockImplementation((skuId: string) => 
    Promise.resolve(variants.find(v => v.skuId === skuId) ?? null)
  ),
});

const createMockEventBus = () => ({
  publish: vi.fn().mockResolvedValue(undefined),
  subscribe: vi.fn().mockReturnValue(() => {}),
});

const createCart = (state = CartState.Active, items = [createCartItem()]) => ({
  id: 'cart-1',
  userId: 'user-1',
  state,
  items,
  subtotal: { amount: 2500 }, // Money object
  initiateCheckout: vi.fn(),
});

const createCartItem = (skuId = 'SKU001', quantity = 2) => ({
  skuId,
  quantity,
  price: { amount: 2500 },
});

const createVariant = (skuId = 'SKU001', availableStock = 10) => ({
  skuId,
  name: 'Test Product',
  price: { amount: 2500 },
  totalOnHand: 100,
  availableStock,
  reserve: vi.fn(),
  releaseReservation: vi.fn(),
});

describe('InitiateCheckout', () => {
  let cartRepo: ReturnType<typeof createMockCartRepo>;
  let stockRepo: ReturnType<typeof createMockStockRepo>;
  let eventBus: ReturnType<typeof createMockEventBus>;

  beforeEach(() => {
    cartRepo = createMockCartRepo();
    stockRepo = createMockStockRepo([createVariant()]);
    eventBus = createMockEventBus();
  });

  describe('happy path', () => {
    it('validates stock for all items, transitions cart, emits event', async () => {
      const cart = createCart(CartState.Active, [
        createCartItem('SKU001', 2),
        createCartItem('SKU002', 1),
      ]);
      cartRepo = createMockCartRepo({ getCart: vi.fn().mockResolvedValue(cart) });
      stockRepo = createMockStockRepo([
        createVariant('SKU001', 10),
        createVariant('SKU002', 5),
      ]);

      const result = await InitiateCheckout(cartRepo, stockRepo, eventBus);

      expect(result.success).toBe(true);
      expect(result.cart).toBe(cart);
      expect(cart.initiateCheckout).toHaveBeenCalled();
      expect(cartRepo.saveCart).toHaveBeenCalledWith(cart);
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'CheckoutInitiated',
          cartId: cart.id,
          userId: cart.userId,
        })
      );
    });
  });

  describe('empty cart', () => {
    it('returns empty_cart error', async () => {
      const cart = createCart(CartState.Active, []);
      cartRepo = createMockCartRepo({ getCart: vi.fn().mockResolvedValue(cart) });

      const result = await InitiateCheckout(cartRepo, stockRepo, eventBus);

      expect(result.success).toBe(false);
      expect(result.reason).toBe('empty_cart');
      expect(cart.initiateCheckout).not.toHaveBeenCalled();
      expect(eventBus.publish).not.toHaveBeenCalled();
    });
  });

  describe('invalid cart state', () => {
    it('returns invalid_state error for Checkout_Pending', async () => {
      const cart = createCart(CartState.Checkout_Pending);
      cartRepo = createMockCartRepo({ getCart: vi.fn().mockResolvedValue(cart) });

      const result = await InitiateCheckout(cartRepo, stockRepo, eventBus);

      expect(result.success).toBe(false);
      expect(result.reason).toBe('invalid_state');
      expect(cart.initiateCheckout).not.toHaveBeenCalled();
      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('returns invalid_state error for Checked_Out', async () => {
      const cart = createCart(CartState.Checked_Out);
      cartRepo = createMockCartRepo({ getCart: vi.fn().mockResolvedValue(cart) });

      const result = await InitiateCheckout(cartRepo, stockRepo, eventBus);

      expect(result.success).toBe(false);
      expect(result.reason).toBe('invalid_state');
    });
  });

  describe('stock conflict', () => {
    it('returns stock_conflict with all conflicting items', async () => {
      const cart = createCart(CartState.Active, [
        createCartItem('SKU001', 2),
        createCartItem('SKU002', 10),
      ]);
      cartRepo = createMockCartRepo({ getCart: vi.fn().mockResolvedValue(cart) });
      stockRepo = createMockStockRepo([
        createVariant('SKU001', 10),  // sufficient
        createVariant('SKU002', 3),   // insufficient (requested 10, available 3)
      ]);

      const result = await InitiateCheckout(cartRepo, stockRepo, eventBus);

      expect(result.success).toBe(false);
      expect(result.reason).toBe('stock_conflict');
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0]).toMatchObject({
        skuId: 'SKU002',
        productName: 'Test Product',
        requestedQuantity: 10,
        availableQuantity: 3,
      });
      expect(cart.initiateCheckout).not.toHaveBeenCalled();
      expect(cartRepo.saveCart).not.toHaveBeenCalled();
    });

    it('returns all conflicts (not just first)', async () => {
      const cart = createCart(CartState.Active, [
        createCartItem('SKU001', 100),
        createCartItem('SKU002', 200),
      ]);
      cartRepo = createMockCartRepo({ getCart: vi.fn().mockResolvedValue(cart) });
      stockRepo = createMockStockRepo([
        createVariant('SKU001', 1),  // insufficient
        createVariant('SKU002', 2), // insufficient
      ]);

      const result = await InitiateCheckout(cartRepo, stockRepo, eventBus);

      expect(result.success).toBe(false);
      expect(result.reason).toBe('stock_conflict');
      expect(result.conflicts).toHaveLength(2); // Both conflicts returned
    });

    it('cart state unchanged after conflict', async () => {
      const cart = createCart(CartState.Active, [createCartItem('SKU001', 100)]);
      cartRepo = createMockCartRepo({ getCart: vi.fn().mockResolvedValue(cart) });
      stockRepo = createMockStockRepo([createVariant('SKU001', 1)]);

      await InitiateCheckout(cartRepo, stockRepo, eventBus);

      expect(cart.state).toBe(CartState.Active); // State unchanged
      expect(cart.initiateCheckout).not.toHaveBeenCalled();
    });
  });
});
```

**Files**:
- `src/features/checkout/model/initiate-checkout.test.ts` (~180 lines)

**Validation**:
- [ ] Happy path test covers: stock validation, state transition, event publishing
- [ ] Empty cart test verifies error return, no side effects
- [ ] Invalid state tests cover Checkout_Pending and Checked_Out
- [ ] Stock conflict test returns all conflicts (not short-circuit)
- [ ] `eventBus.publish` called with correct structure (verify `eventType: 'CheckoutInitiated'`)
- [ ] `cart.initiateCheckout` not called when conflicts detected
- [ ] Cart state unchanged after conflict scenario

---

### Subtask T006: Create Public API Index

**Purpose**: Expose the checkout feature's public API for consumption by widgets and pages.

**File**: `src/features/checkout/index.ts`

**Implementation**:
```typescript
export { InitiateCheckout } from './model/initiate-checkout';
export { CheckoutInitiated } from './model/events';
export { InitiateCheckoutResult, StockConflict } from './model/result-types';
export type { CartState } from '@/entities/cart';
```

**Validation**:
- [ ] Re-exports `InitiateCheckout` function
- [ ] Re-exports `CheckoutInitiated` event type
- [ ] Re-exports `InitiateCheckoutResult` and `StockConflict` types
- [ ] Can be imported via `import { InitiateCheckout } from '@/features/checkout'`

---

## Definition of Done

- [ ] All test scenarios implemented (happy path, empty cart, invalid state, stock conflict with multiple conflicts)
- [ ] Tests verify `eventBus.publish` called with correct `eventType: 'CheckoutInitiated'`
- [ ] Tests verify cart state is NOT modified when stock conflict occurs
- [ ] Tests verify cart state is NOT modified when cart is empty or invalid
- [ ] All tests pass: `npm test`
- [ ] Public API properly exports all necessary types and functions
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

## Risks

- None identified — tests follow established patterns from similar features (e.g., T-011 cart-actions)

## Reviewer Guidance

1. Verify tests cover ALL 4 result variants
2. Verify conflict array returns ALL conflicts (not short-circuit)
3. Verify cart state is unchanged when conflict/error occurs
4. Verify `eventBus.publish` is called with `eventType: 'CheckoutInitiated'`
5. Verify no `any` types in test mocks
6. Verify imports follow FSD boundaries
