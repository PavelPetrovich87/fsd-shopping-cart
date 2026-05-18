# Quickstart: CartRow and EmptyState Development

**Feature**: CartRow and EmptyState Entity UI
**Mission**: 024-entity-ui-cartrow-emptystate

---

## Development Workflow

### 1. Start Storybook

```bash
npm run storybook
```

Navigate to the component stories:
- CartRow: `http://localhost:6006/?path=/story/entities-cart-cartrow--default`
- EmptyState: `http://localhost:6006/?path=/story/entities-cart-emptystate--default`

### 2. Implement Component

Follow the story-first convention:
1. Write the `.stories.tsx` file first (defines all states)
2. Implement the `.tsx` component to satisfy stories
3. Verify visually in Storybook

### 3. Run Quality Gates

```bash
# Code quality
npm run lint

# FSD architecture
npm run lint:arch

# Type check + build
npm run build
```

All commands must exit with code 0.

### 4. Verify Design Tokens

If adding custom Tailwind classes, verify they exist in the built CSS:

```bash
grep 'your-class-name' dist/assets/index-*.css
```

---

## File Locations

| File | Path |
|---|---|
| CartRow component | `src/entities/cart/ui/cart-row/cart-row.tsx` |
| CartRow stories | `src/entities/cart/ui/cart-row/cart-row.stories.tsx` |
| CartRow index | `src/entities/cart/ui/cart-row/index.ts` |
| EmptyState component | `src/entities/cart/ui/empty-state/empty-state.tsx` |
| EmptyState stories | `src/entities/cart/ui/empty-state/empty-state.stories.tsx` |
| EmptyState index | `src/entities/cart/ui/empty-state/index.ts` |
| Entity public API | `src/entities/cart/index.ts` (update) |

---

## Required Skills

Before editing UI files, load these skills:

```bash
# For all src/ files
fsd-architecture

# For UI component files
story-first-ui
fsd-ui-styling-constraints
tailwind-design-system
```

---

## Reusable Components

| Component | Import Path | Props Reference |
|---|---|---|
| Button | `src/shared/ui/shadcn/button.tsx` | See `button.tsx` for variants/sizes |
| CartControl | `src/shared/ui/shadcn/cart-control/cart-control.tsx` | `CartControlProps` |

---

## Design Token Usage

All styling must use design tokens. Key tokens for this feature:

| Token Category | File | Usage |
|---|---|---|
| Colors | `src/shared/ui/tokens/colors.ts` | Backgrounds, borders, text colors |
| Spacing | `src/shared/ui/tokens/spacing.ts` | Gaps, padding, margins |
| Typography | `src/shared/ui/tokens/typography.ts` | Font sizes, weights |
| Radius | `src/shared/ui/tokens/radius.ts` | Border radius (CartRow image: 8px) |
| Shadows | `src/shared/ui/tokens/shadows.ts` | Elevation |

CSS custom properties are available in `src/shared/ui/tokens/theme.css`.

---

## Storybook Story States

### CartRow Stories

| Story Name | Props |
|---|---|
| Default | quantity=2, all controls enabled |
| MinQuantity | quantity=1, decrement disabled |
| MaxQuantity | quantity=99, increment disabled |
| Disabled | disabled=true, all controls disabled |
| WithSpecs | specs={Color: 'Blue', Size: 'M'} |

### EmptyState Stories

| Story Name | Props |
|---|---|
| Default | primaryAction only |
| WithSecondaryAction | primaryAction + secondaryAction |
| CustomIcon | Custom icon component |
