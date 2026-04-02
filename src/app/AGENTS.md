# app

## Goal

Bootstrap the application: global providers, routing setup, global styles. This is the entry point, not a feature container.

## Content

- `styles/` — Global CSS, Tailwind imports
- Provider wrappers (QueryClient, Theme, Auth)
- Router configuration (route definitions map paths to pages)
- `main.tsx` / `index.tsx` — Application entry point

## Directive

- You MUST NOT place UI components here. Visual elements belong in widgets or pages.
- You MUST NOT put feature-specific logic here.
- You MAY import from all underlying layers to initialize the application tree.
- Route definitions live here; page components live in `pages/`.

## Common Mistakes

- Placing a navigation bar or footer directly in app instead of creating a widget.
- Adding business logic to providers (e.g., auth checks that belong in a feature).
- Confusing app with pages — app wires the router, pages define what each route renders.
