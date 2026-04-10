---
work_package_id: WP01
title: Foundation — Types & Events
dependencies: []
requirement_refs:
- FR-001
- FR-005
- FR-006
- FR-007
- FR-008
- FR-009
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-005-coupon-aggregate
base_commit: 24f5c02f871ee8dfe8900170d08bc599374f5f36
created_at: '2026-04-10T12:11:08.338556+00:00'
subtasks: [T001, T002]
shell_pid: "19423"
authoritative_surface: src/entities/coupon/model/
execution_mode: code_change
owned_files: [src/entities/coupon/model/types.ts, src/entities/coupon/model/events.ts]
agent: "kilocode:o3:reviewer:reviewer"
---

# Work Package: WP01 — Foundation Types & Events

## Objective

Create the type definitions and domain event structures that form the foundation of the Coupon aggregate. This work package creates `types.ts` and `events.ts` which define the data shapes and event contracts used throughout the coupon system.

## Context

**Feature**: Coupon Aggregate (005-coupon-aggregate)
**Spec**: [spec.md](../../spec.md)
**Plan**: [plan.md](../../plan.md)

The Coupon aggregate is a domain entity that:
- Supports two discount modes: `flat` (fixed amount) and `percentage`
- Has optional validity periods (`validFrom`, `expiresAt`)
- Emits typed domain events for validation and discount calculation
- Depends on `Money` value object and `EventBus` from `shared/lib`

### Key Decisions (from plan.md)

1. **Percentage storage**: Separate `percentageValue: number` field (cleaner than encoding as Money cents)
2. **Flat discount storage**: `discountAmount: Money` for fixed-amount coupons
3. **Validation order**: Check `isActive` → check `validFrom` → check `expiresAt`

---

## T001: Create types.ts

**Purpose**: Define all TypeScript interfaces and types for the Coupon aggregate.

### Implementation Steps

1. **Create file**: `src/entities/coupon/model/types.ts`

2. **Define `CouponMode` type**:
   ```typescript
   export type CouponMode = 'flat' | 'percentage';
   ```

3. **Define `CouponProps` interface**:
   ```typescript
   export interface CouponProps {
     code: string;              // Unique identifier (normalized to uppercase)
     discountMode: CouponMode;
     discountAmount?: Money;   // For flat mode (e.g., $5 off)
     percentageValue?: number;  // For percentage mode (e.g., 10 = 10%)
     validFrom?: Date | null;  // Optional start date
     expiresAt?: Date | null;  // Optional expiration date
     isActive: boolean;         // Deactivation flag
   }
   ```

4. **Define `CouponValidationReason` type** (for failure events):
   ```typescript
   export type CouponValidationReason = 'expired' | 'not_yet_active' | 'inactive' | 'not_found';
   ```

5. **Import Money from shared/lib**:
   ```typescript
   import { Money } from '@/shared/lib';
   ```

6. **Export all types** so they can be used by other modules.

### Files
- `src/entities/coupon/model/types.ts` (new file, ~40 lines)

### Validation Checklist
- [ ] `CouponMode` type is a union of 'flat' | 'percentage'
- [ ] `CouponProps` has all required fields with correct types
- [ ] Money is imported from `@/shared/lib`
- [ ] All types are exported

---

## T002: Create events.ts

**Purpose**: Define TypeScript interfaces for all domain events emitted by the Coupon aggregate.

### Implementation Steps

1. **Create file**: `src/entities/coupon/model/events.ts`

2. **Import base types**:
   ```typescript
   import { Money } from '@/shared/lib';
   import { CouponValidationReason } from './types';
   ```

3. **Define `CouponValidated` event**:
   ```typescript
   export interface CouponValidated {
     type: 'CouponValidated';
     couponCode: string;
     timestamp: Date;
   }
   ```

4. **Define `CouponValidationFailed` event**:
   ```typescript
   export interface CouponValidationFailed {
     type: 'CouponValidationFailed';
     couponCode: string;
     reason: CouponValidationReason;
     timestamp: Date;
   }
   ```

5. **Define `DiscountCalculated` event**:
   ```typescript
   export interface DiscountCalculated {
     type: 'DiscountCalculated';
     couponCode: string;
     subtotal: Money;
     discount: Money;
     resultingTotal: Money;
     timestamp: Date;
   }
   ```

6. **Create union type for all coupon events**:
   ```typescript
   export type CouponDomainEvent = CouponValidated | CouponValidationFailed | DiscountCalculated;
   ```

7. **Export all events**.

### Files
- `src/entities/coupon/model/events.ts` (new file, ~35 lines)

### Validation Checklist
- [ ] `CouponValidated` has correct fields
- [ ] `CouponValidationFailed` includes reason field
- [ ] `DiscountCalculated` includes subtotal, discount, and resultingTotal
- [ ] `CouponDomainEvent` union type covers all events
- [ ] All events extend/implement `DomainEvent` pattern (type field)

---

## Integration Points

Both T001 and T002 create foundational files that will be imported by:
- `coupon.ts` (WP02) — uses these types to define the aggregate
- `index.ts` (WP02) — re-exports for public API

## Definition of Done

- [ ] `src/entities/coupon/model/types.ts` exists with all required types
- [ ] `src/entities/coupon/model/events.ts` exists with all domain events
- [ ] Types compile without TypeScript errors
- [ ] All exports are correctly named and accessible

## Risks

- **Low**: This is straightforward type definition work
- No complex business logic, just TypeScript interfaces

## Reviewer Guidance

Verify:
1. Types match the data model in plan.md
2. Event payloads match the trigger conditions in spec.md Section 8
3. All imports use correct paths (`@/shared/lib` for Money)
4. No implementation details leak into type definitions

## Activity Log

- 2026-04-10T12:11:17Z – kilocode:o3:implementer:implementer – shell_pid=19423 – Assigned agent via action command
- 2026-04-10T12:13:12Z – kilocode:o3:implementer:implementer – shell_pid=19423 – Ready for review
- 2026-04-10T12:13:32Z – kilocode:o3:reviewer:reviewer – shell_pid=19423 – Started review via action command
- 2026-04-10T12:14:47Z – kilocode:o3:reviewer:reviewer – shell_pid=19423 – Review passed: coupon types and domain events match WP01 requirements; lint, arch lint, and build all pass
