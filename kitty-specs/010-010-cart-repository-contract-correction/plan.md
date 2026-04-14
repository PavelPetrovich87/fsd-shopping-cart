# Implementation Plan: 010 Cart Repository Contract Correction

## Branch Contract

- Current branch at plan start: `main`
- Intended planning/base branch: `main`
- Final merge target: `main`
- `branch_matches_target`: true

## Charter Context

No charter file found at `.kittify/charter/charter.md`. Skipping Charter Check.

## Summary

Restore async `ICartRepository` contract (drifted to sync during T-009 merge), restore two port files deleted during cross-mission merge conflict (`coupon/model/ports.ts`, `product/model/ports.ts`), and update ZustandCartRepository adapter and integration tests to use async signatures.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: React 19, Zustand, Vitest
**Testing**: Vitest unit + integration tests
**Target Platform**: Web application (React)

### Current File State vs Required

| File | Current State | Required State |
| ---- | ------------- | -------------- |
| `src/entities/cart/model/ports.ts` | `getCart(): Cart`, `saveCart(): void` (sync) | `getCart(): Promise<Cart>`, `saveCart(): Promise<void>` (async) |
| `src/entities/cart/api/zustand-cart-repository.ts` | Sync adapter | Wrap in `Promise.resolve()` |
| `src/entities/cart/api/zustand-cart-repository.integration.test.ts` | Sync calls | `await` on async calls |
| `src/entities/coupon/model/ports.ts` | **Missing** (deleted during T-009 merge) | Restore from git `2c09b43` |
| `src/entities/product/model/ports.ts` | **Missing** (deleted during T-009 merge) | Restore from git `2c09b43` |
| `src/entities/coupon/index.ts` | No port type export | Add `export type { ICouponRepository } from './model/ports'` |
| `src/entities/product/index.ts` | No port type export | Add `export type { IStockRepository } from './model/ports'` |

### Gate Summary

- `npm run lint` — ESLint (code quality)
- `npm run lint:arch` — Steiger FSD linter (architecture compliance)
- `npm run build` — TypeScript compilation + Vite bundle
- `npm run test:unit` — Vitest unit tests (131 existing tests must pass)

## Project Structure

```
kitty-specs/010-010-cart-repository-contract-correction/
├── plan.md              # This file
├── spec.md              # Mission specification
├── checklists/
│   └── requirements.md # Quality checklist
├── tasks/               # Work package tasks (created by /spec-kitty.tasks)
└── status.events.jsonl  # Mission events
```

## Implementation Approach

### WP01: Contract Correction & File Restoration

**Files to restore from git `2c09b43`**:

1. `src/entities/coupon/model/ports.ts` — `ICouponRepository` with `findByCode(code: string): Promise<Coupon | null>`
2. `src/entities/product/model/ports.ts` — `IStockRepository` with `findBySku` and `save` async signatures

**Files to modify**:

3. `src/entities/cart/model/ports.ts` — change `ICartRepository` to async signatures
4. `src/entities/cart/api/zustand-cart-repository.ts` — wrap `getCart()` and `saveCart()` in `Promise.resolve()`
5. `src/entities/cart/api/zustand-cart-repository.integration.test.ts` — add `await` to all repository calls
6. `src/entities/coupon/index.ts` — add `export type { ICouponRepository } from './model/ports'`
7. `src/entities/product/index.ts` — add `export type { IStockRepository } from './model/ports'`

**Verification**: All 7 quality gates + all 131 existing unit tests pass.

### Scope Constraints

- Only restore and correct existing contracts — no new functionality
- Do not modify Zustand store structure (state shape, actions)
- Do not modify Cart aggregate or domain logic
- Do not touch `cart-store.test.ts` (already sync store tests)

## Work Packages

| WP | Description | Files | Status |
| -- | ----------- | ----- | ------ |
| WP01 | Contract Correction & File Restoration | 7 files | pending |

## Next Step

Run `/spec-kitty.tasks` to generate work package task files.
