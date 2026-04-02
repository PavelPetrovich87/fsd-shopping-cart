# entities

## Goal

Define business objects, their data shapes, and fundamental operations — isolated from user interactions.

## Content

Each entity is a slice (e.g., `product/`) with segments:

- `ui/` — Presentational components for this entity (e.g., ProductCard)
- `model/` — TypeScript interfaces, state, business logic (`model/types.ts` for domain types)
- `api/` — Data fetching specific to this entity (e.g., `getProducts()`)
- `index.ts` — Public API. Export ONLY what other layers need.

## Directive

- You MUST NOT import from features, widgets, pages, or app.
- You MUST NOT import from sibling entity slices. If `order` needs `User` type, use the `@x` cross-reference pattern or lift composition to a feature.
- You MUST export through `index.ts` only. No wildcard re-exports (`export *`).
- All external imports use absolute paths (`@/shared/...`). All internal imports use relative paths (`./model/types`).

## Common Mistakes

- Cross-entity imports to share types (e.g., `entities/order` importing from `entities/user`).
- Bypassing `index.ts` with deep imports like `@/entities/product/model/types`.
- Placing generic utility types here. Generic types (`ApiResponse`, `Nullable`) belong in `shared/lib/`.
