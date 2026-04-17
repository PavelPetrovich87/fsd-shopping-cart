# Design Tokens

## 1. Mission Overview

**Type:** software-dev  
**Slug:** 016-design-tokens  
**Created:** 2026-04-17

### Intent Summary

Create design tokens (CSS custom properties) that extract raw values from the Penpot design system and map them to shadcn/ui semantics for use with Tailwind v4 CSS @theme block. Tokens cover colors, typography, spacing, and border radius.

---

## 2. User Scenarios & Testing

### Scenario: Theme Application

**Given** a React component using design token variables  
**When** the component renders  
**Then** all visual styling (colors, fonts, spacing, borders) derives from CSS custom properties defined in the @theme block

### Scenario: Token Consumption

**Given** a UI component styled with design tokens  
**When** a designer updates a token value in Penpot  
**Then** the change propagates to all components consuming that token without code changes

### Scenario: shadcn/ui Integration

**Given** the design tokens are defined  
**When** shadcn/ui components render  
**Then** they respect the semantic token mappings (--background, --foreground, --primary, etc.)

---

## 3. Requirements

### Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | Extract primitive color values from Penpot library colors and shape fills | Pending |
| FR-002 | Define CSS custom properties for all extracted color primitives | Pending |
| FR-003 | Map color primitives to shadcn/ui semantic tokens (--background, --foreground, --primary, --border, etc.) | Pending |
| FR-004 | Extract typography values from Penpot library typographies (font family, sizes, weights) | Pending |
| FR-005 | Define CSS custom properties for typography scale | Pending |
| FR-006 | Map typography to shadcn/ui font semantics | Pending |
| FR-007 | Extract spacing values from Penpot flex layout rowGap/columnGap and shape dimensions | Pending |
| FR-008 | Define CSS custom properties for spacing scale (--spacing-* using Tailwind numeric scale) | Pending |
| FR-009 | Extract border radius values from Penpot token set "2. Radius/Mode 1" | Pending |
| FR-010 | Define CSS custom properties for border radius scale | Pending |
| FR-011 | Output all tokens in a single CSS @theme block | Pending |

### Non-Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-001 | Tokens must be CSS custom properties (--*) | Pending |
| NFR-002 | All tokens must be output in a single @theme block compatible with Tailwind v4 | Pending |
| NFR-003 | Primitive tokens must use exact hex/rgb values from Penpot | Pending |
| NFR-004 | Semantic tokens must follow shadcn/ui naming conventions | Pending |
| NFR-005 | Spacing tokens must use Tailwind numeric scale (1→4px, 2→8px, 4→16px, etc.) | Pending |
| NFR-006 | Do NOT invent values not present in Penpot | Pending |

### Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | Output file: `src/shared/ui/tokens/theme.css` | Pending |
| C-002 | All tokens defined in single @theme block (no separate @layer) | Pending |
| C-003 | If shadcn requires a semantic token not present in Penpot, derive it from nearest primitive | Pending |

---

## 4. Source Values from Penpot

### Colors (from Library Colors and Shape Fills)

#### Brand Colors
| Penpot Name | Hex Value | Token Name (Primitive) | shadcn Semantic |
|-------------|-----------|------------------------|-----------------|
| brand | #4338ca | --color-brand-600 | --primary |
| brand-primary-emphasize | #3730a3 | --color-brand-700 | --primary-foreground (derived) |
| brand-subtle | #eef2ff | --color-brand-100 | (background use) |
| Badge | #eef2ff | --color-brand-100 | (same) |

#### Neutral Colors
| Penpot Name | Hex Value | Token Name (Primitive) | shadcn Semantic |
|-------------|-----------|------------------------|-----------------|
| primary (dark) | #171717 | --color-neutral-900 | --foreground |
| text-title | #404040 | --color-neutral-800 | (derived from #171717) |
| secondary | #525252 | --color-neutral-700 | (text-secondary) |
| text-hint / text-placeholder | #737373 | --color-neutral-600 | --muted-foreground |
| disabled | #a3a3a3 | --color-neutral-500 | (disabled state) |
| Rectangle 9 | #d4d4d4 | --color-neutral-400 | --border |
| secondary | #e5e7eb | --color-neutral-300 | (lighter border) |
| tag | #e5e7eb | --color-neutral-300 | (same) |
| White | #ffffff | --color-neutral-50 | --background |
| Cart Control / Input / Content | #fafafa | --color-neutral-100 | (card background) |
| background | #fafafa | --color-neutral-100 | --background |
| Title | #f5f5f5 | --color-neutral-200 | (subtle background) |

#### Special Colors
| Penpot Name | Hex Value | Token Name (Primitive) | shadcn Semantic |
|-------------|-----------|------------------------|-----------------|
| error | #dc2626 | --color-error-600 | --destructive |
| text-error | #dc2626 | --color-error-600 | (text error) |
| Modal, Popup / Tooltip shape | #0a0a0a | --color-neutral-950 | (modal bg) |
| primary-invert / White / Content | #ffffff | --color-neutral-50 | --background |
| order-summary / Card | #ffffff | --color-neutral-50 | (same) |

### Typography (from Library Typography)

#### Font Family
- **Primary:** "Noto Sans", system-ui, sans-serif

#### Font Sizes (px → rem)
| Penpot fontSize | rem value | Token Name | shadcn Semantic |
|-----------------|-----------|------------|-----------------|
| 12 | 0.75rem | --font-size-xs | text-xs |
| 14 | 0.875rem | --font-size-sm | text-sm |
| 16 | 1rem | --font-size-base | text-base |
| 18 | 1.125rem | --font-size-lg | text-lg |
| 20 | 1.25rem | --font-size-xl | text-xl |
| 24 | 1.5rem | --font-size-2xl | text-2xl |
| 30 | 1.875rem | --font-size-3xl | text-3xl |
| 36 | 2.25rem | --font-size-4xl | text-4xl |
| 48 | 3rem | --font-size-5xl | text-5xl |
| 72 | 4.5rem | --font-size-6xl | text-6xl |

#### Font Weights
| Penpot fontWeight | Token Name | shadcn Semantic |
|-------------------|------------|-----------------|
| 400 | --font-weight-normal | normal |
| 500 | --font-weight-medium | medium |
| 600 | --font-weight-semibold | semibold |
| 700 | --font-weight-bold | bold |

### Spacing (from Flex Layout Gaps)

| Penpot Layout Value | Tailwind Scale | CSS Variable |
|---------------------|----------------|--------------|
| 4 | --spacing-1 | 0.25rem (4px) |
| 8 | --spacing-2 | 0.5rem (8px) |
| 10 | --spacing-2.5 | 0.625rem (10px) |
| 12 | --spacing-3 | 0.75rem (12px) |
| 15 | --spacing-4 | 1rem (16px) |
| 16 | --spacing-4 | 1rem (16px) |
| 32 | --spacing-8 | 2rem (32px) |
| 36 | --spacing-9 | 2.25rem (36px) |
| 64 | --spacing-16 | 4rem (64px) |

### Border Radius (from Token Set "2. Radius/Mode 1")

| Penpot Token | Value | CSS Variable |
|--------------|-------|--------------|
| rounded | 4px | --radius-sm |
| rounded-lg | 8px | --radius-md |

---

## 5. Design Decisions

### Decision 1: Semantic Token Mapping for Error

**Context:** Penpot defines `error: #dc2626` and `text-error: #dc2626`. shadcn/ui uses `--destructive` for error states.

**Resolution:** Map `--color-error-600` (#dc2626) to both `--destructive` and `--destructive-foreground` (white text on destructive bg).

### Decision 2: Missing Neutral-100 vs Neutral-50

**Context:** Both #ffffff and #fafafa appear as "white-ish" backgrounds. Penpot has separate "White" (#ffffff) and "Cart Control" (#fafafa).

**Resolution:** 
- #ffffff → `--color-neutral-50` (--background, --card, --popover)
- #fafafa → `--color-neutral-100` (secondary background, subtle fills)

### Decision 3: Derived Semantic Tokens

**Context:** shadcn requires `--primary-foreground` but Penpot only has brand-emphasize (#3730a3) as a dark variant.

**Resolution:** Derive `--primary-foreground` as #ffffff (white text on primary blue) since white is used for primary-invert text.

---

## 6. Output Structure

```
src/shared/ui/tokens/
└── theme.css    # Single @theme block with all design tokens
```

### @theme Block Structure

```css
@theme {
  /* === PRIMITIVE COLOR TOKENS === */
  --color-brand-700: #3730a3;
  --color-brand-600: #4338ca;
  --color-brand-100: #eef2ff;
  --color-neutral-950: #0a0a0a;
  --color-neutral-900: #171717;
  --color-neutral-800: #404040;
  --color-neutral-700: #525252;
  --color-neutral-600: #737373;
  --color-neutral-500: #a3a3a3;
  --color-neutral-400: #d4d4d4;
  --color-neutral-300: #e5e7eb;
  --color-neutral-200: #f5f5f5;
  --color-neutral-100: #fafafa;
  --color-neutral-50: #ffffff;
  --color-error-600: #dc2626;

  /* === SHADCN SEMANTIC COLOR TOKENS === */
  --background: #ffffff;
  --foreground: #171717;
  --card: #ffffff;
  --card-foreground: #171717;
  --popover: #ffffff;
  --popover-foreground: #171717;
  --primary: #4338ca;
  --primary-foreground: #ffffff;
  --secondary: #fafafa;
  --secondary-foreground: #171717;
  --muted: #fafafa;
  --muted-foreground: #737373;
  --accent: #fafafa;
  --accent-foreground: #171717;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --border: #e5e7eb;
  --input: #fafafa;
  --ring: #4338ca;

  /* === TYPOGRAPHY TOKENS === */
  --font-family: "Noto Sans", system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 4.5rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* === SPACING TOKENS === */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-2.5: 0.625rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-8: 2rem;
  --spacing-9: 2.25rem;
  --spacing-16: 4rem;

  /* === RADIUS TOKENS === */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
}
```

---

## 7. Assumptions

1. **Font Family Fallback:** Penpot specifies "Noto Sans" as the sole font. System-ui fallback is added for cross-platform consistency.
2. **Line Height:** Not explicitly specified in Penpot typography; using Tailwind defaults (1 for headings, 1.75 for body).
3. **Letter Spacing:** Penpot shows "0" for all typographies; not creating explicit letter-spacing tokens.
4. **Shadow Tokens:** No shadow tokens found in Penpot; not creating shadow design tokens.

---

## 8. Key Entities

- **Primitive Token:** Raw value extracted directly from Penpot (e.g., `--color-brand-600: #4338ca`)
- **Semantic Token:** shadcn/ui mapped token referencing primitive (e.g., `--primary: var(--color-brand-600)`)
- **Theme Block:** Single CSS `@theme` block containing all design tokens

---

## 9. Success Criteria

| # | Criterion |
|---|-----------|
| 1 | All Penpot library colors are represented as primitive tokens |
| 2 | All semantic shadcn/ui color tokens map to appropriate primitives |
| 3 | Typography scale covers all font sizes used in Penpot (12-72px) |
| 4 | Spacing tokens align with Tailwind numeric scale (1, 2, 3, 4, 8, 9, 16) |
| 5 | Border radius tokens match Penpot token set values |
| 6 | All tokens output in single @theme block |
| 7 | File created at `src/shared/ui/tokens/theme.css` |
| 8 | No values invented that don't exist in Penpot |