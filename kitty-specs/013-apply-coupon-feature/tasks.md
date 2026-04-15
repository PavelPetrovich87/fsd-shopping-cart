# Tasks: Apply Coupon Feature (T-013)

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|----|----------|
| T001 | Create `model/errors.ts` — ApplyCouponError discriminated union | WP01 | [P] | [D] |
| T002 | Create `model/events.ts` — CouponApplied, CouponRemoved event interfaces | WP01 | [D] |
| T003 | Create `model/results.ts` — ApplyCouponResult, RemoveCouponResult types | WP01 | [D] |
| T004 | Create `model/apply-coupon.ts` — ApplyCoupon use case | WP02 | | [D] |
| T005 | Create `model/remove-coupon.ts` — RemoveCoupon use case | WP02 | | [D] |
| T006 | Create `model/index.ts` — re-exports for errors, events, results | WP02 | | [D] |
| T007 | Create `index.ts` — public API entry point | WP02 | | [D] |
| T008 | Create `model/apply-coupon.test.ts` — unit tests for ApplyCoupon + RemoveCoupon | WP03 | |
| T009 | Run lint, lint:arch, build — verify all checks pass | WP03 | |

---

## Work Packages

### WP01: Foundation — Types & Events

**Summary**: Create the foundational type files (errors, events, results) that the use cases depend on. These are independent files that can be created in parallel.

**Priority**: High (foundation for WP02)

**Subtasks**:
- [x] T001 Create `model/errors.ts` — ApplyCouponError discriminated union
- [x] T002 Create `model/events.ts` — CouponApplied, CouponRemoved event interfaces
- [x] T003 Create `model/results.ts` — ApplyCouponResult, RemoveCouponResult types

**Implementation Order**: T001 → T002 → T003 (but all are independent enough to parallelize if desired)

**Prompt File**: `WP01-foundation-types.md`

---

### WP02: Use Cases — ApplyCoupon & RemoveCoupon

**Summary**: Implement the two main use cases following T-011 (Cart Actions) patterns exactly. Uses types from WP01.

**Priority**: High (core business logic)

**Subtasks**:
- [x] T004 Create `model/apply-coupon.ts` — ApplyCoupon use case
- [x] T005 Create `model/remove-coupon.ts` — RemoveCoupon use case
- [x] T006 Create `model/index.ts` — re-exports
- [x] T007 Create `index.ts` — public API

**Implementation Order**: T004, T005 (independent), then T006, T007 (depend on T004/T005)

**Prompt File**: `WP02-use-cases.md`

---

### WP03: Testing & Validation

**Summary**: Write unit tests covering all use case paths, then verify the implementation passes all quality gates.

**Priority**: High (validation)

**Subtasks**:
- [ ] T008 Create `model/apply-coupon.test.ts` — unit tests with mocked ICartRepository, ICouponRepository, EventBus
- [ ] T009 Run lint, lint:arch, build — verify all checks pass

**Implementation Order**: T008 then T009 (T009 depends on T008 passing)

**Prompt File**: `WP03-tests-validation.md`

---

## Validation

- [x] T001: errors.ts created with ApplyCouponError discriminated union
- [x] T002: events.ts created with CouponApplied, CouponRemoved interfaces
- [x] T003: results.ts created with ApplyCouponResult, RemoveCouponResult
- [x] T004: apply-coupon.ts implements ApplyCoupon per spec
- [x] T005: remove-coupon.ts implements RemoveCoupon per spec
- [x] T006: model/index.ts re-exports errors, events, results, use cases
- [x] T007: index.ts re-exports model use cases
- [ ] T008: test file created with all scenarios from spec
- [ ] T009: All quality gates pass (lint, lint:arch, build)

## Dependency Graph

```
WP01 (T001-T003) ──┬──▶ WP02 (T004-T007) ──▶ WP03 (T008-T009)
                  │        (uses T001-T003 types)
                  │
                  └─────── No other dependencies
```

## Notes

- **Parallelization**: WP01 files (T001, T002, T003) can be created simultaneously by 3 agents
- **WP01 before WP02**: Use cases import from foundation types
- **WP02 before WP03**: Tests exercise the use cases
- **Total estimated lines**: ~650-800 across 3 WP prompt files
- **Size validation**: ✓ All WPs within 3-7 subtask target