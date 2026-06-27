# Task Plan: Product Card

**Mission**: product-card-01KW2695  
**Created**: 2026-06-26  
**Spec**: `kitty-specs/product-card-01KW2695/spec.md`  
**Plan**: `kitty-specs/product-card-01KW2695/plan.md`

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|----|----------|
| T001 | Verify `Money` utility supports ProductCard formatting | WP01 | [P] |
| T002 | Verify fixtures have sale and non-sale variants | WP01 | [P] |
| T003 | Define `ProductCardProps` interface in component file | WP01 | [P] |
| T004 | Create barrel export `index.ts` for ProductCard | WP01 | [P] |
| T005 | Create Storybook stories (default, sale, skeleton) | WP01 | [P] |
| T006 | Implement ProductCard with default, sale, and skeleton states | WP02 | [P] |
| T007 | Add responsive design for desktop, tablet, and mobile | WP02 | [P] |
| T008 | Add accessibility (alt text, semantic HTML, ARIA) | WP02 | [P] |
| T009 | Export ProductCard from `entities/product/index.ts` | WP02 | [P] |
| T010 | Run quality gates (lint, lint:arch, build) | WP02 | [P] |

---

## WP01: ProductCard Foundation & Stories

**Prompt**: `tasks/WP01-product-card-foundation.md`

**Goal**: Establish the ProductCard component foundation, verify existing utilities, and create Storybook stories following the story-first convention.

**Priority**: High (blocks WP02)

**Success Criteria**:
- `Money` utility confirmed to produce formatted prices like "$29.99"
- `ProductCardProps` interface defined with all required fields
- Storybook stories exist for default, sale, and skeleton states
- Barrel export is set up for the component directory
- All files compile without TypeScript errors

**Dependencies**: None

**Parallel Opportunities**: All subtasks within WP01 can be completed sequentially in one focused session.

**Risks**: If `Money` utility doesn't support simple formatting, a fallback `centsToDollars` helper may be needed. If fixtures don't have both sale and non-sale variants, additional fixtures may be needed.

**Estimated Prompt Size**: ~350 lines

### Subtasks

- [ ] T001 Verify `Money` utility from `shared/lib/money.ts` supports ProductCard formatting
- [ ] T002 Verify `shared/api/fixtures/products.ts` has both sale and non-sale variants for stories
- [ ] T003 Define `ProductCardProps` interface in `src/entities/product/ui/ProductCard/ProductCard.tsx`
- [ ] T004 Create barrel export `src/entities/product/ui/ProductCard/index.ts`
- [ ] T005 Create Storybook stories (default, sale, skeleton) in `src/entities/product/ui/ProductCard/ProductCard.stories.tsx`

---

## WP02: ProductCard Implementation & Quality

**Prompt**: `tasks/WP02-product-card-implementation.md`

**Goal**: Implement the ProductCard component with all visual states, responsive design, accessibility, and pass all quality gates.

**Priority**: High

**Success Criteria**:
- ProductCard renders correctly for all three states (default, sale, skeleton)
- Sale price is visually distinct with strikethrough list price
- Component is responsive across desktop, tablet, and mobile
- All accessibility requirements met (alt text, semantic HTML, WCAG contrast)
- Component exported from `entities/product/index.ts`
- `npm run lint`, `npm run lint:arch`, and `npm run build` all pass

**Dependencies**: WP01

**Parallel Opportunities**: T007 (responsive) and T008 (accessibility) can be developed in parallel with T006 (component implementation), but all must be committed together.

**Risks**: Image aspect ratio must be consistent; Tailwind classes must use design tokens only; skeleton state must not cause layout shift.

**Estimated Prompt Size**: ~400 lines

### Subtasks

- [ ] T006 Implement ProductCard component with default, sale, and skeleton states
- [ ] T007 Add responsive design for desktop, tablet, and mobile
- [ ] T008 Add accessibility (alt text, semantic HTML, ARIA)
- [ ] T009 Export ProductCard from `src/entities/product/index.ts`
- [ ] T010 Run quality gates (`npm run lint`, `npm run lint:arch`, `npm run build`)

---

## MVP Scope

**WP01 + WP02** constitute the complete MVP. Both work packages must be implemented for the ProductCard to be usable by the HomePage (T-028).

## Parallelization Summary

- **WP01** is independent and can start immediately.
- **WP02** depends on WP01 (needs the component interface and stories).
- Within each WP, subtasks are sequential but small enough to complete in a single session.

## Next Steps

After WP02 is complete, the ProductCard component is ready for integration into the HomePage (T-028). No additional work packages are needed for this mission.
