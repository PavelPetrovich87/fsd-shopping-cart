# Layer Directives

## `app`

### Goal

Bootstrap the application: global providers, routing setup, global styles. This is the entry point, not a feature container.

### Content

- `styles/` — Global CSS, Tailwind imports
- Provider wrappers (QueryClient, Theme, Auth)
- Router configuration (route definitions map paths to pages)
- `main.tsx` / `index.tsx` — Application entry point

### Directive

- You MUST NOT place UI components here. Visual elements belong in widgets or pages.
- You MUST NOT put feature-specific logic here.
- You MAY import from all underlying layers to initialize the application tree.
- Route definitions live here; page components live in `pages/`.

### Common Mistakes

- Placing a navigation bar or footer directly in app instead of creating a widget.
- Adding business logic to providers (e.g., auth checks that belong in a feature).
- Confusing app with pages — app wires the router, pages define what each route renders.

---

## `pages`

### Goal

Assemble widgets, features, and entities into complete, routable views. Pages are layout scaffolding — thin and logic-free.

### Content

- One component per route
- Imports widgets and features, arranges them in a layout
- `index.ts` — Public API

### Directive

- You MUST NOT implement business logic, data fetching, or complex styling here.
- You MUST NOT import from app.
- You MAY import from widgets, features, entities, and shared.
- A page component should rarely exceed 50-100 lines. If it does, extract a widget.

### Common Mistakes

- Building a monolithic page with all logic, fetching, and UI inline.
- Placing layout/grid logic that could be a widget directly in the page.
- Fetching data in the page instead of delegating to feature/entity API segments.

---

## `widgets`

### Goal

Compose multiple features and entities into self-contained, meaningful UI blocks (e.g., Header, ProductCatalog, CartSidebar).

### Content

- `ui/` — Composite components that wire together lower-layer imports
- `index.ts` — Public API

Widgets are orchestrators. They connect features and entities but do not own business logic.

### Directive

- You MUST NOT import from pages or app.
- You MUST NOT define raw API calls or state management here. Delegate to features and entities.
- You MUST NOT create business logic. If you're writing `if (quantity > stock)` — that belongs in a feature or entity.
- You MAY import from features, entities, and shared.

### Common Mistakes

- Re-implementing business logic that already exists in a feature (e.g., duplicating cart calculations).
- Making API calls directly instead of using feature/entity hooks.
- Treating widgets as "big components" — they are compositional glue, not logic containers.

---

## `features`

### Goal

Implement specific user interactions that carry business value (e.g., AddToCart, Checkout, UserLogin).

### Content

Each feature is an isolated slice (e.g., `shopping-cart/`) with segments:

- `ui/` — Components handling user events
- `model/` — Feature-local state and business logic
- `api/` — Mutations and queries specific to this feature
- `index.ts` — Public API

### Directive

- You MUST NOT import from sibling features. If `checkout` needs `auth`, they must be composed in a widget or page — not coupled here.
- You MUST NOT import from widgets, pages, or app.
- You MAY import from entities and shared only.
- If two features share logic, extract it down to `entities/` or `shared/`.

### Common Mistakes

- Cross-feature imports for "convenience" (e.g., `features/checkout` importing `features/auth`). This is the most common FSD violation agents make.
- Duplicating entity logic inside a feature instead of importing from the entity slice.
- Creating a feature for something that has no user interaction — that's an entity, not a feature.

---

## `entities`

### Goal

Define business objects, their data shapes, and fundamental operations — isolated from user interactions.

### Content

Each entity is a slice (e.g., `product/`) with segments:

- `ui/` — Presentational components for this entity (e.g., ProductCard)
- `model/` — TypeScript interfaces, state, business logic (`model/types.ts` for domain types)
- `api/` — Data fetching specific to this entity (e.g., `getProducts()`)
- `index.ts` — Public API. Export ONLY what other layers need.

### Directive

- You MUST NOT import from features, widgets, pages, or app.
- You MUST NOT import from sibling entity slices. If `order` needs `User` type, use the `@x` cross-reference pattern or lift composition to a feature.
- You MUST export through `index.ts` only. No wildcard re-exports (`export *`).
- All external imports use absolute paths (`@/shared/...`). All internal imports use relative paths (`./model/types`).

### Common Mistakes

- Cross-entity imports to share types (e.g., `entities/order` importing from `entities/user`).
- Bypassing `index.ts` with deep imports like `@/entities/product/model/types`.
- Placing generic utility types here. Generic types (`ApiResponse`, `Nullable`) belong in `shared/lib/`.

---

## `shared`

### Goal

Provide pure, reusable infrastructure with zero knowledge of the business domain.

### Content

- `ui/` — Generic UI components (Button, Input, Modal, Card)
- `lib/` — Utility functions (formatPrice, cn, date helpers)
- `api/` — HTTP client instance and base request helpers only
- `config/` — Environment variables, theme tokens, constants

Segments may import from each other (e.g., `ui/` can use `lib/`).

### Directive

- You MUST NOT import from any other FSD layer (entities, features, widgets, pages, app).
- You MUST NOT use domain-specific names. Use `ItemCard`, not `ProductCard`. Use `fetchList`, not `fetchProducts`.
- You MUST NOT add application state management (Zustand, Redux) here. Components receive data through props only.
- If a component needs business data or API calls → it belongs in `entities/` or `features/`, not here.

### Common Mistakes

- Injecting domain logic into a shared button (e.g., adding `onClick` that calls a cart API).
- Placing domain-specific API handlers (`getProducts()`) here instead of in entity/feature `api/` segments.
- Creating `utils/` or `hooks/` folders. Use `lib/` for utilities, place hooks in the appropriate segment by purpose.
