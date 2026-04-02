# features

## Goal

Implement specific user interactions that carry business value (e.g., AddToCart, Checkout, UserLogin).

## Content

Each feature is an isolated slice (e.g., `shopping-cart/`) with segments:

- `ui/` — Components handling user events
- `model/` — Feature-local state and business logic
- `api/` — Mutations and queries specific to this feature
- `index.ts` — Public API

## Directive

- You MUST NOT import from sibling features. If `checkout` needs `auth`, they must be composed in a widget or page — not coupled here.
- You MUST NOT import from widgets, pages, or app.
- You MAY import from entities and shared only.
- If two features share logic, extract it down to `entities/` or `shared/`.

## Common Mistakes

- Cross-feature imports for "convenience" (e.g., `features/checkout` importing `features/auth`). This is the most common FSD violation agents make.
- Duplicating entity logic inside a feature instead of importing from the entity slice.
- Creating a feature for something that has no user interaction — that's an entity, not a feature.
