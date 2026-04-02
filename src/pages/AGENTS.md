# pages

## Goal

Assemble widgets, features, and entities into complete, routable views. Pages are layout scaffolding — thin and logic-free.

## Content

- One component per route
- Imports widgets and features, arranges them in a layout
- `index.ts` — Public API

## Directive

- You MUST NOT implement business logic, data fetching, or complex styling here.
- You MUST NOT import from app.
- You MAY import from widgets, features, entities, and shared.
- A page component should rarely exceed 50-100 lines. If it does, extract a widget.

## Common Mistakes

- Building a monolithic page with all logic, fetching, and UI inline. This is the default LLM behavior — fight it.
- Placing layout/grid logic that could be a widget directly in the page.
- Fetching data in the page instead of delegating to feature/entity API segments.
