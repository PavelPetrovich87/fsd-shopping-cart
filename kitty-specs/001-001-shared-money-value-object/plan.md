# Implementation Plan: Shared Money Value Object

**Branch**: `001-001-shared-money-value-object` | **Date**: 2026-04-08 | **Spec**: `spec.md`
**Input**: Feature specification from `/kitty-specs/001-001-shared-money-value-object/spec.md`

## Summary

Implement a `Money` Value Object in `src/shared/lib/money.ts` for the FSD shopping cart project. Money wraps financial amounts as integers (cents) to avoid floating-point errors. Supports add, subtract, multiply, equals, and format operations. Immutable - all operations return new instances.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: None (pure TypeScript)
**Storage**: N/A
**Testing**: Vitest (already in devDependencies)
**Target Platform**: Browser/Node.js
**Project Type**: Library (shared utility)
**Performance Goals**: N/A
**Constraints**: All operations must be pure functions with no side effects
**Scale/Scope**: Small - single file with ~100 lines

## Charter Check

- FSD Layer: `shared/lib/` - no cross-slice dependencies
- Named exports only (no export default)
- Unit tests required in `money.test.ts`
- Re-export from `shared/lib/index.ts`
- Quality gates: `npm run lint && npm run lint:arch && npm run build`

## Project Structure

### Source Code (FSD layout)

```
src/
└── shared/
    └── lib/
        └── money.ts          # Money class implementation
        └── money.test.ts     # Unit tests
        └── index.ts          # Re-exports Money

kitty-specs/001-001-shared-money-value-object/
└── plan.md                   # This file
```

**Structure Decision**: Single class in `shared/lib/` segment per FSD conventions. No cross-slice imports.

## Implementation Approach

### Step 1: Create Money class

File: `src/shared/lib/money.ts`

```typescript
export class Money {
  private constructor(
    private readonly cents: number,
    private readonly currency: string = "USD"
  ) {}

  static fromPrice(dollars: number): Money {
    return new Money(dollars * 100);
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents, this.currency);
  }

  subtract(other: Money): Money {
    return new Money(this.cents - other.cents, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.cents * factor), this.currency);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency;
  }

  format(): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this.currency,
    }).format(this.cents / 100);
  }
}
```

### Step 2: Create unit tests

File: `src/shared/lib/money.test.ts`

- Test fromPrice factory
- Test arithmetic operations (add, subtract, multiply)
- Test equals
- Test format
- Test immutability

### Step 3: Update re-export

File: `src/shared/lib/index.ts`

Add: `export { Money } from "./money";`

### Step 4: Quality gates

Run in sequence:
1. `npm run lint` - ESLint
2. `npm run lint:arch` - Steiger FSD linter
3. `npm run build` - TypeScript compile

## Complexity Tracking

No complexity violations expected.
