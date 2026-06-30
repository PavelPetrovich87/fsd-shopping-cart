---
schema_version: 1
artifact_type: spec-kitty.analysis-report
command: /spec-kitty.analyze
mission_slug: product-card-01KW2695
mission_id:
generated_at: '2026-06-30T15:39:33.536438+00:00'
analyzer_agent: unknown
input_artifacts:
  spec.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/product-card-01KW2695/spec.md
    sha256: c69baf751fa46975a6c54dd966d0a92a2baf66266d6ff8c76826ac3c2fc65912
  plan.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/product-card-01KW2695/plan.md
    sha256: a5880a6c059cc76b1d716f17bba6a3e7fa90052a8f5ddcc42c0bb28179e05eff
  tasks.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/product-card-01KW2695/tasks.md
    sha256: 2b37a44a9ea02d6364045a0a3363b3987d7d4c72ebf08b246c8e622821375bd5
  charter:
    path: /Users/user/work/fsd-shopping-cart/.kittify/charter/charter.md
    sha256: f32ac3d17fdc264c47940a263643ab6eb42bdbdc54e3f7e9c91af316a4e6a14c
verdict: unknown
issue_counts:
  critical:
  high:
  low:
  info:
  medium:
findings: []
---

---
schema_version: 1
artifact_type: spec-kitty.analysis-report
command: /spec-kitty.analyze
mission_slug: product-card-01KW2695
mission_id: 01KW2695
input_artifacts:
  spec.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/product-card-01KW2695/spec.md
    sha256: placeholder
  plan.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/product-card-01KW2695/plan.md
    sha256: placeholder
  tasks.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/product-card-01KW2695/tasks.md
    sha256: placeholder
  charter:
    path: /Users/user/work/fsd-shopping-cart/.kittify/charter/charter.md
    sha256: placeholder
verdict: proceed
issue_counts:
  critical: 0
  high: 1
  medium: 3
  low: 1
  info: 0
findings:
  - id: A1
    category: ambiguity
    severity: high
    locations: [spec.md:FR-005]
    summary: NFR-005 requires the component tree to render a single DOM node, which is impossible for a card containing an image, product name, and price block.
    recommendation: Remove NFR-005 or rephrase to a realistic shallow-depth target (e.g., "avoid unnecessary wrapper divs").
  - id: A2
    category: underspecification
    severity: medium
    locations: [spec.md:FR-001]
    summary: FR-001 lists two possible aspect ratios (1:1 or 4:3) without choosing one for the implementation.
    recommendation: Add an explicit design decision to spec.md or plan.md selecting 1:1 or 4:3, and align the tasks/stories accordingly.
  - id: A3
    category: underspecification
    severity: medium
    locations: [spec.md:FR-003]
    summary: The sale price "highlighted" style is not tied to a specific design token or color.
    recommendation: Specify the token (e.g., text-error-600 or text-brand-600) in the spec or plan before WP02 begins.
  - id: A4
    category: coverage
    severity: medium
    locations: [spec.md:NFR-001, plan.md:Phase 0, tasks.md:T010]
    summary: NFR-001 (16ms render budget) is not explicitly verified by any task; T010 only runs lint/lint:arch/build.
    recommendation: Add a note to WP02 to profile the component in Storybook or browser DevTools, or downgrade NFR-001 to aspirational.
  - id: A5
    category: terminology
    severity: low
    locations: [spec.md:FR-003, plan.md:data-model]
    summary: FR-003 prose refers to salePrice/listPrice while the data model uses salePriceCents/listPriceCents.
    recommendation: Keep the data model as the source of truth and update the requirement prose to mention cents-to-dollars formatting.
---

# Pre-implementation Analysis: T-031 Product Card

## Mission Summary

Create a `ProductCard` pure presentation component in `src/entities/product/ui/` that displays a product image, name, and price (with sale price highlight when applicable). The deliverables include Storybook stories for default, sale, and skeleton states, and a public export from `src/entities/product/index.ts`. The mission is small, bounded, and follows the existing FSD / story-first conventions established by T-025.

## Existing Code Relevant to the Mission

- `src/shared/lib/money.ts` — `Money` value object for formatting cents as dollars.
- `src/shared/api/fixtures/products.ts` — `Product` fixtures with `listPriceCents` and `salePriceCents`.
- `src/entities/cart/ui/cart-row/cart-row.tsx` — entity-level presentational component pattern to mirror (props-only, responsive, story-first).
- `src/entities/cart/ui/cart-row/cart-row.stories.tsx` — story structure and MSW/fixture usage pattern.
- `src/entities/product/index.ts` — public API export point; currently does not export ProductCard.
- `src/shared/ui/tokens/theme.css` — design tokens for colors, spacing, and typography.

## Proposed File Structure

```
src/entities/product/
├── ui/
│   └── ProductCard/
│       ├── ProductCard.tsx
│       ├── ProductCard.stories.tsx
│       └── index.ts
└── index.ts
```

## Implementation Notes

1. **Pure presentation**
   - ProductCard accepts all data via props and does not import any store or repository.
   - It lives in the `entities` layer and therefore must not import from `features/` or `widgets/`.

2. **Money formatting**
   - Use `Money.fromCents(cents).format()` from `src/shared/lib/money.ts` for both list and sale prices.

3. **Responsive design**
   - Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) and design-token classes.
   - The card itself should be fluid; the grid layout is owned by the HomePage (T-028).

4. **Story-first**
   - WP01 creates stories before the component implementation.
   - Stories cover default, sale, and skeleton states using fixtures.

5. **Accessibility**
   - Product image must have descriptive `alt` text (e.g., `name`).
   - Use semantic HTML (`article`, `h3` for product name, `p` for price).
   - Ensure WCAG AA contrast for all text tokens.

## Risks and Open Questions

- **NFR-005 single-DOM-node target**: Impossible as written; should be rephrased before implementation or treated as aspirational.
- **Aspect ratio**: Need to pick 1:1 or 4:3 and document it.
- **Sale highlight color**: Need to bind it to a concrete design token.

## Suggested WP Execution Order

1. **WP01** — Verify utilities/fixtures, define props, create barrel, create stories.
2. **WP02** — Implement component, responsive design, accessibility, public export, quality gates.

WP02 depends on WP01; no parallel execution is possible between WPs for this two-WP mission.

## Next Actions

- Proceed with implementation after resolving the open questions in the analysis findings table (especially A1 and A2).
- If the user accepts the analysis as-is, run `/spec-kitty.implement` to start WP01.
