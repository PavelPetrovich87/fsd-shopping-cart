# Design Token System

A three-layer design token system for the FSD Shopping Cart project. All tokens are extracted from Penpot mockups and maintained in TypeScript with CSS custom property fallbacks.

## Token Layers

This design token system uses a three-layer architecture:

### 1. Primitive Tokens

Raw, context-free design values. These are the source of truth for all derived tokens.

Example: `brand-700: hsl(245 58% 51%)` — the raw indigo color

### 2. Semantic Tokens

Contextual mappings of primitive tokens to usage contexts.

Example: `primary: hsl(245 58% 51%)` — maps the brand color to the primary action context

### 3. Component Tokens

Widget-specific tokens for component states.

Example: `button-focus-ring: hsl(245 59% 55%)` — the indigo focus ring shadow used on buttons

## Naming Conventions

All token names follow `category-purpose-variant` kebab-case format:

- **Category**: color, typography, spacing, radius, shadow, breakpoint, z-index
- **Purpose**: descriptive context (primary, background, foreground)
- **Variant**: optional modifier (sm, md, lg, full)

Examples:
- `color-brand-700` — brand color at 700 intensity
- `color-neutral-950` — neutral color at 950 intensity
- `spacing-4` — 4rem spacing (4 × 16px base)
- `radius-sm` — small border radius (4px)

## TypeScript Usage

Import individual token modules:

```typescript
import { primitiveColors, semanticColors } from '@/shared/ui/tokens';
import { spacing } from '@/shared/ui/tokens';
import { fontSizes, fontWeights } from '@/shared/ui/tokens';

// Use in styled components or inline styles
const buttonStyle = {
  backgroundColor: semanticColors.primary,
  padding: spacing['4'],
  fontSize: fontSizes.sm,
};
```

Or import the aggregated theme object:

```typescript
import { theme } from '@/shared/ui/tokens';

// Access all tokens through the theme object
const buttonStyle = {
  backgroundColor: theme.colors.semantic.primary,
  padding: theme.spacing['4'],
};
```

## CSS Custom Property Usage

Import `theme.css` in your application entry point:

```typescript
// main.tsx or App.tsx
import '@/shared/ui/tokens/theme.css';
```

Use CSS custom properties in your styles:

```css
.button {
  background-color: var(--primary);
  padding: var(--spacing-4);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-subtle);
}
```

## Value Sources

**Penpot-extracted values** (exact):
- All primitive colors from the Penpot style guide
- Button, tooltip, card, and input shadow values
- Border radius sm (4px) and md (8px)

**Derived values** (standard conventions):
- Spacing: 20, 24, 40, 48, 80, 96, 128px (4px grid)
- Border radius: lg (12px), xl (16px), full (9999px)
- Font weights: 600, 700 (added for future component needs)
- Z-index scale (standard layering conventions)

## File Structure

```
src/shared/ui/tokens/
├── colors.ts        # Primitive + semantic color tokens
├── typography.ts    # Font sizes, weights, families
├── spacing.ts       # Spacing scale (4px grid)
├── radius.ts        # Border radius tokens
├── shadows.ts       # Shadow/elevation tokens
├── breakpoints.ts   # Responsive breakpoint widths
├── z-index.ts       # Z-index layering scale
├── index.ts         # Theme aggregation + re-exports
├── theme.css        # CSS custom properties
├── tokens.stories.tsx # Storybook visual reference
└── README.md        # This file
```

## Categories

### Colors (`colors.ts`)

- **Primitive colors**: 16 values (brand, neutral, error)
- **Semantic colors**: 19 values (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring)
- **Component colors**: 4 values (buttonFocusRing, buttonErrorRing, inputFocus, inputError)

### Typography (`typography.ts`)

- **Font family**: Noto Sans with system-ui fallback
- **Font sizes**: xs (12px) through 6xl (72px) in rem
- **Font weights**: normal (400), medium (500), semibold (600), bold (700)
- **Line heights**: tight (1.0) through loose (1.5)

### Spacing (`spacing.ts`)

13 values on a 4px grid: 4px through 128px

### Radius (`radius.ts`)

5 values: sm (4px), md (8px), lg (12px), xl (16px), full (9999px)

### Shadows (`shadows.ts`)

5 shadow tokens:
- **subtle**: Light elevation for buttons
- **medium**: Medium elevation for tooltips
- **large**: High elevation for cards
- **focusRing**: Indigo focus ring (`0 0 0 4px rgba(68,76,231,0.12)`)
- **errorRing**: Red error ring (`0 0 0 4px rgba(217,45,32,0.12)`)

### Breakpoints (`breakpoints.ts`)

4 responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Z-Index (`z-index.ts`)

5 layering levels: dropdown (100), sticky (200), modal (300), tooltip (400), toast (500)
