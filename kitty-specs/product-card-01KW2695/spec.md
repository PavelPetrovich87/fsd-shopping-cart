# Mission Specification: Product Card

**Mission Type**: `software-dev`  
**Created**: 2026-06-26  
**Source**: T-031 @docs/TICKETS.md  
**Mission Slug**: `product-card-01KW2695`  
**Target Branch**: `main`  

---

## 1. Feature Description

Create a `ProductCard` pure presentation component in the `entities/product` layer. This component displays a product image, name, and price information (with sale price strikethrough when applicable). It is used by the HomePage (T-028) to render a product grid. The ProductCard is strictly presentational — all interactive logic (add-to-cart, stock checks) is handled by the page or feature layer that wraps it.

---

## 2. Problem / Opportunity

The application needs a reusable, consistent product card for displaying products across the storefront. Currently, no such component exists. The HomePage (T-028) requires a product grid where each card shows a product image, name, and price. Without a dedicated ProductCard component, the HomePage would need to inline presentation logic, violating the FSD principle of keeping entity presentation in the `entities` layer.

---

## 3. Scope

### In Scope
- `ProductCard` presentational component in `entities/product/ui/`
- Support for sale price display (strikethrough list price + highlighted sale price)
- Storybook stories for default and sale variants
- Responsive image sizing
- Public API export from `entities/product/index.ts`

### Out of Scope
- AddToCart button (feature layer — T-028 or T-010)
- Stock status badge / out-of-stock indicator (handled by wrapping page)
- Product category filtering
- Product detail page navigation
- Animations or hover effects beyond CSS-only

---

## 4. Dependencies

| Dependency | Reason |
|------------|--------|
| T-025 (Entity UI — CartRow, EmptyState) | Sets the entity UI conventions and patterns to follow (story-first, props-only, responsive) |
| T-017 (Design System Foundation) | Design tokens for colors, typography, spacing, border radius |
| T-003 (Shared Fixtures) | Product data for stories and test fixtures |
| T-005 (ProductVariant Aggregate) | Domain types for product data structure |

---

## 5. Design Reference

### Penpot File
- **File Name**: `shopping-cart-section-figma`
- **File ID**: `4cba8d8d-63bf-80c5-8007-e20e604c26a0`
- **Page Name**: `Design`
- **Page ID**: `6af293a7-f75e-808e-8007-e20dfb265d42`

### Relevant Design Boards (from T-026 StockConflictModal)
| Element | Shape ID | Description |
|---------|----------|-------------|
| Product card (2 cards variant) | `a8277032-687c-5fff-9bf6-5a57bd60a3d8` | Inline product card within StockConflictModal — visual reference for card layout |
| Product card (1 card variant) | `f24bc276-1984-581c-b5a7-38157e1469f4` | Inline product card within StockConflictModal — visual reference for card layout |

> **Note**: The standalone ProductCard does not have a dedicated design board in the current Penpot file. The inline product cards from the StockConflictModal (T-026) serve as the visual reference for layout, typography, and spacing.

### Supported Viewports
- Desktop (≥1024px): standard card size in grid
- Tablet (768px–1023px): slightly smaller card
- Mobile (≤767px): full-width card, stacked in grid

---

## 6. Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | ProductCard displays a product image at a consistent aspect ratio (1:1 or 4:3) | `pending` |
| FR-002 | ProductCard displays the product name below the image | `pending` |
| FR-003 | ProductCard displays the product price: if `salePrice` exists, show `listPrice` with strikethrough formatting and `salePrice` highlighted; otherwise show `listPrice` only | `pending` |
| FR-004 | ProductCard accepts all product data via props — no direct store or repository access | `pending` |
| FR-005 | ProductCard is responsive: image and text scale appropriately across desktop, tablet, and mobile viewports | `pending` |
| FR-006 | ProductCard supports a loading/skeleton state when product data is not yet available | `pending` |
| FR-007 | ProductCard has Storybook stories covering: default state (no sale), sale state, and skeleton state | `pending` |

---

## 7. Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|-------------|-----------|--------|
| NFR-001 | Component renders within 16ms (single frame) | First contentful paint ≤ 16ms | `pending` |
| NFR-002 | Images use lazy loading where supported | Below-the-fold images deferred | `pending` |
| NFR-003 | Component is fully accessible | Passes axe-core automated checks | `pending` |
| NFR-004 | All text meets WCAG AA contrast ratios | Contrast ratio ≥ 4.5:1 | `pending` |
| NFR-005 | Component tree is shallow (renders a single DOM node) | ≤ 3 levels of nesting | `pending` |

---

## 8. Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | Component must live in `entities/product/ui/` — pure presentation, no domain logic | `pending` |
| C-002 | Must follow FSD import rules: entity UI can import from `shared/`, but not from `features/` or `widgets/` | `pending` |
| C-003 | Must use design tokens for all visual properties (colors, typography, spacing, radius) | `pending` |
| C-004 | Must include Storybook stories before implementation (story-first convention) | `pending` |
| C-005 | Product data must be typed using the existing `Product` fixture type | `pending` |
| C-006 | No external dependencies beyond existing project stack (React, TypeScript, Tailwind) | `pending` |

---

## 9. User Scenarios & Testing

### Scenario 1: Default Product Card (No Sale)
**Given** a product with `listPriceCents = 2999` and `salePriceCents = null`  
**When** the ProductCard renders  
**Then** it displays the product image, name, and price as "$29.99" with no strikethrough

### Scenario 2: Sale Product Card
**Given** a product with `listPriceCents = 5999` and `salePriceCents = 4499`  
**When** the ProductCard renders  
**Then** it displays the original price "$59.99" with strikethrough and the sale price "$44.99" highlighted

### Scenario 3: Responsive Grid
**Given** a product grid of 6 ProductCards on desktop  
**When** the viewport is resized to tablet and then mobile  
**Then** the grid adapts from 3 columns → 2 columns → 1 column, and cards scale appropriately

### Scenario 4: Loading Skeleton
**Given** product data is loading  
**When** the ProductCard renders in skeleton mode  
**Then** it shows a placeholder image and text blocks without layout shift

---

## 10. Key Entities

| Entity | Type | Description |
|--------|------|-------------|
| ProductCard | UI Component | Presentational card showing product image, name, and price |
| Product | Data Type | `skuId`, `name`, `description`, `imageUrl`, `listPriceCents`, `salePriceCents`, `category` |
| ProductCardProps | Type | Props interface: image, name, listPrice, salePrice, skuId, and optional loading state |

---

## 11. Success Criteria

- ProductCard renders correctly with all product data types from fixtures
- Sale price display is visually distinct and clearly communicates the discount
- Component passes accessibility checks (alt text, semantic HTML, color contrast)
- Storybook stories exist for all visual states (default, sale, skeleton)
- Component is imported and used by the HomePage (T-028) without modification
- All lint and build checks pass
- Component renders in under 16ms on a reference device

---

## 12. Assumptions

1. The `Product` fixture type from `shared/api/fixtures/products.ts` is the canonical data shape for the ProductCard
2. Product images are already hosted and available via URLs (not blob/base64)
3. The standalone ProductCard is a simple card without hover animations, rating stars, or other e-commerce features
4. The wrapping page (HomePage, T-028) will handle layout, grid, and interactivity (add-to-cart)
5. Money formatting is handled by the existing `Money` value object or utility function

---

## 13. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Product data shape changes | Low | Medium | Use the fixture type; any changes propagate from the data source |
| No dedicated Penpot design for standalone card | Low | Low | Use inline card from T-026 as reference; iterate with design review |
| Image loading performance | Medium | Low | Use lazy loading; use `picsum.photos` (fixture) for testing |

---

## 14. Open Questions

*None remaining.*
