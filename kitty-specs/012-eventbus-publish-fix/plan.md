# Implementation Plan: 012-eventbus-publish-fix

**Branch**: `012-eventbus-publish-fix` | **Date**: 2026-04-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/kitty-specs/012-eventbus-publish-fix/spec.md`

## Summary

Fix the `EventBus.publish` bug where cart domain events are silently dropped. The `EventBus` interface uses `type: string` for handler lookup, but cart events use `eventType`. Resolution: change `DomainEvent.type` to `DomainEvent.eventType` in the EventBus interface, update all publish/subscribe calls, align product and coupon events to use `eventType` (instead of inconsistent `type`/`payload` structures), and remove unsafe type casts from cart-actions use cases. Tests updated to verify `eventBus.publish` is called with correct event structure.

## Technical Context

**Language/Version**: TypeScript 5.9 (React 19 project)  
**Primary Dependencies**: TypeScript, Vitest (unit testing), ESLint, steiger (FSD architecture linter)  
**Storage**: N/A (in-memory event bus, Zustand for cart state)  
**Testing**: Vitest (`npm run test:unit`), `npm run lint`, `npm run lint:arch`, `npm run build`  
**Target Platform**: Web browser (React SPA)  
**Project Type**: Web application — Feature-Sliced Design architecture  
**Performance Goals**: N/A (no performance impact from this bug fix)  
**Constraints**: No `as unknown as` type casts may remain (NFR-001), all domain events must use `eventType` (C-001), product events must flatten `payload` into top-level fields (C-003)  
**Scale/Scope**: 3 files modified in EventBus, 2 files in domain events, 3 files in cart-actions use cases, 4 test files updated

## Charter Check

**Mode**: compact (governance unresolved — template_set issue in charter, non-blocking for this bug fix)

No gates to pass. This is a Trivial bug fix. All requirements are fully specified in `spec.md`.

## Project Structure

### Source Code

```
src/
├── shared/lib/
│   ├── event-bus.ts              # DomainEvent.eventType fix
│   └── event-bus.test.ts        # Test fixtures updated
├── entities/
│   ├── cart/model/
│   │   └── events.ts            # Already uses eventType (no change)
│   ├── product/model/
│   │   └── events.ts            # type→eventType, flatten payload, add occurredAt
│   └── coupon/model/
│       └── events.ts             # type→eventType, timestamp→occurredAt
└── features/cart-actions/model/
    ├── add-to-cart.ts           # Remove unsafe cast
    ├── add-to-cart.test.ts      # Verify eventBus.publish called correctly
    ├── remove-from-cart.ts      # Remove unsafe cast
    ├── remove-from-cart.test.ts # Verify eventBus.publish called correctly
    ├── change-quantity.ts       # Remove unsafe cast
    └── change-quantity.test.ts  # Verify eventBus.publish called correctly
```

**Structure Decision**: Same FSD structure as existing codebase — no structural changes, only file edits.

---

## Phase 0: Research

**Not applicable** — all unknowns resolved in spec.md. No research needed.

---

## Phase 1: Design & Contracts

**Not applicable** — pure bug fix with no design decisions or API contracts to generate.

---

## Work Package Breakdown

Single WP (WP-001): Fix EventBus.publish bug

**Steps**:
1. Update `src/shared/lib/event-bus.ts`: `DomainEvent.type` → `DomainEvent.eventType`
2. Update `src/shared/lib/event-bus.test.ts`: all event fixtures use `eventType`
3. Update `src/entities/product/model/events.ts`: `type` → `eventType`, flatten `payload`, add `occurredAt`
4. Update `src/entities/coupon/model/events.ts`: `type` → `eventType`, `timestamp` → `occurredAt`
5. Update `src/features/cart-actions/model/add-to-cart.ts`: remove `as unknown as { type: string }` cast
6. Update `src/features/cart-actions/model/add-to-cart.test.ts`: assert `eventBus.publish` called with correct event
7. Update `src/features/cart-actions/model/remove-from-cart.ts`: remove cast
8. Update `src/features/cart-actions/model/remove-from-cart.test.ts`: assert `eventBus.publish` called correctly
9. Update `src/features/cart-actions/model/change-quantity.ts`: remove cast
10. Update `src/features/cart-actions/model/change-quantity.test.ts`: assert `eventBus.publish` called correctly
11. Run `npm run lint`, `npm run lint:arch`, `npm run build` — all must exit 0

---

## Verification

1. `npm run lint` — ESLint passes with 0 errors
2. `npm run lint:arch` — steiger passes with 0 errors  
3. `npm run build` — TypeScript compiles without errors
4. `npm run test:unit` — all tests pass, including updated event delivery assertions
