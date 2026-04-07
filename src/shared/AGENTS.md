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

## Story-First Convention

When creating a component in `shared/ui/`:

1. Write `ComponentName.stories.tsx` FIRST — define Default + all variants/sizes/states
2. Use CSF3 format: `export default satisfies Meta<typeof Component>`
3. Write the component to satisfy the stories
4. Stories stay forever — they are regression guards, not temporary tests

Example bug-first story:

```tsx
// src/shared/ui/shadcn/ButtonOverflow.stories.tsx
// Reproduces: long text overflow in icon button
export const Overflow: Story = {
  args: {
    size: 'icon',
    children: 'Long text that should not overflow the container',
  },
}
```

## Directives (Reinforced)

- Story-first for ALL shared/ui components — no exceptions
- Stories live next to components (e.g., `button.tsx` + `button.stories.tsx`)
- Use shadcn components from `shared/ui/shadcn/` when available (cva + TypeScript = strict contract)
