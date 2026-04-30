---
name: fsd-ui-styling-constraints
description: FSD-specific UI styling constraints — zero-trust components, token law, component authority, layout translation, and typography strictness. Prerequisite — tailwind-design-system. Use when editing any UI file in src/shared/ui/, src/entities/**/ui/, src/features/**/ui/, or src/widgets/**/ui/.
---

# FSD UI Styling Constraints

## When to Use

- Any UI file in `src/shared/ui/**`, `src/entities/**/ui/**`, `src/features/**/ui/**`, `src/widgets/**/ui/**`

## Prerequisite

Load the `tailwind-design-system` skill first. This skill adds FSD-specific constraints on top of Tailwind v4 design tokens.

## Rule 1: Zero-Trust Styling

Custom `shared/ui` components must NOT accept a `className` prop. Consumers control appearance through `variant`/`size` props only.

- `shadcn/` subdirectory exception: library components retain `className` via `cn()` + `cva`
- ESLint enforcement: `no-restricted-syntax` on `JSXAttribute[name.name="className"]` in `src/shared/ui/**/*.{ts,tsx}` (excluding `shadcn/`)

```tsx
// ❌ Violation: open className prop
type ButtonProps = { className?: string; children: React.ReactNode }

// ✅ Correct: constrained variant props
type ButtonProps = {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

## Rule 2: Token Law

NO ARBITRARY VALUES. Never `text-[#FF5733]`, `w-[314px]`, `rounded-[10px]`.

- Use theme variables: `text-primary`, `w-80`, `rounded-md`
- Fallback: if Penpot pixel value not in Tailwind scale, use closest standard token
- Single source of truth: `src/shared/ui/tokens/theme.css` (Tailwind v4 `@theme` block)

## Rule 3: Component Authority (shadcn/ui First)

For base UI elements (Button, Input, Dialog, Select, Card), use pre-built shadcn/ui from `@/shared/ui/shadcn/`.

- Map Penpot states to shadcn `variant`/`size` props
- Extend via `className` + `cn()`, never rewrite internal logic

## Rule 4: Layout Translation (Penpot to Code)

- Auto Layout → CSS Flexbox or Grid
- Penpot "Gap" → Tailwind `gap-*`
- Never use margins (`mt-*`, `ml-*`) to separate items within Auto Layout container
- Padding: match Penpot exactly with `p-*`, `px-*`, `py-*`

## Rule 5: Component Does Not Control Its Own Layout

No `margin`, `position: absolute`, `grid-column` on root element.

```tsx
// ❌ Violation: component dictates its own margin
export const ProductCard = () => (
  <div className="mt-8 ml-4 rounded-lg bg-white p-4">...</div>
)

// ✅ Correct: only internal styles
export const ProductCard = () => (
  <div className="rounded-lg bg-white p-4">...</div>
)
// Parent handles layout: <div className="mt-8 ml-4"><ProductCard /></div>
```

## Rule 6: Color Semantics

Never raw colors: `bg-blue-500`

- Use semantic roles: `bg-background`, `text-foreground`, `bg-primary`, `border-border`
- Dark mode compatibility automatic via semantic variables

## Rule 7: Typography Strictness

- Penpot "Heading 1" → `text-2xl font-bold tracking-tight`
- Penpot "Body Small" → `text-sm text-muted-foreground`
- No arbitrary line heights unless defined as token

## Rule 8: Escape Hatches via Composition, Not Styles

```tsx
// ❌ Violation: style override
<Card className="border-red-500" />

// ✅ Correct: composition
<Card header={<AlertBanner />}>
  <ErrorContent />
</Card>
```
