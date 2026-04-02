# widgets

## Goal

Compose multiple features and entities into self-contained, meaningful UI blocks (e.g., Header, ProductCatalog, CartSidebar).

## Content

- `ui/` — Composite components that wire together lower-layer imports
- `index.ts` — Public API

Widgets are orchestrators. They connect features and entities but do not own business logic.

## Directive

- You MUST NOT import from pages or app.
- You MUST NOT define raw API calls or state management here. Delegate to features and entities.
- You MUST NOT create business logic. If you're writing `if (quantity > stock)` — that belongs in a feature or entity.
- You MAY import from features, entities, and shared.

## Common Mistakes

- Re-implementing business logic that already exists in a feature (e.g., duplicating cart calculations).
- Making API calls directly instead of using feature/entity hooks.
- Treating widgets as "big components" — they are compositional glue, not logic containers.
