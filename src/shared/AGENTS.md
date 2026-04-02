# shared

## Goal

Provide pure, reusable infrastructure with zero knowledge of the business domain.

## Content

- `ui/` — Generic UI components (Button, Input, Modal, Card)
- `lib/` — Utility functions (formatPrice, cn, date helpers)
- `api/` — HTTP client instance and base request helpers only
- `config/` — Environment variables, theme tokens, constants

Segments may import from each other (e.g., `ui/` can use `lib/`).

## Directive

- You MUST NOT import from any other FSD layer (entities, features, widgets, pages, app).
- You MUST NOT use domain-specific names. Use `ItemCard`, not `ProductCard`. Use `fetchList`, not `fetchProducts`.
- You MUST NOT add application state management (Zustand, Redux) here. Components receive data through props only.
- If a component needs business data or API calls → it belongs in `entities/` or `features/`, not here.

## Common Mistakes

- Injecting domain logic into a shared button (e.g., adding `onClick` that calls a cart API).
- Placing domain-specific API handlers (`getProducts()`) here instead of in entity/feature `api/` segments.
- Creating `utils/` or `hooks/` folders. Use `lib/` for utilities, place hooks in the appropriate segment by purpose.
