# Conventions

Machine-enforceable rules only. Every rule is binary (violated or not), syntax-verifiable, and locally checkable.

Subjective guidelines ("keep functions small", "write clean code") are explicitly excluded.

---

## 1. FSD Import Rules

### 1.1 No Higher-Level Imports `[steiger]`

A module may only import from layers **below** it in the hierarchy.

```
app → pages → widgets → features → entities → shared
```

```ts
// ❌ Violation: entity importing from features (higher layer)
import { addToCart } from '@/features/shopping-cart'

// ✅ Correct: feature importing from entity (lower layer)
import { Product } from '@/entities/product'
```

### 1.2 No Cross-Slice Imports `[steiger]`

Slices within the same layer cannot import from each other.

```ts
// ❌ Violation: feature importing from sibling feature
import { useWishlist } from '@/features/wishlist'

// ✅ Correct: move shared logic down to entities or shared
import { ProductCard } from '@/entities/product'
```

### 1.3 Public API Only `[steiger]`

All cross-boundary imports must go through the slice's `index.ts`. Direct imports into internal folders are forbidden.

```ts
// ❌ Violation: reaching into internal structure
import { CartButton } from '@/features/shopping-cart/ui/CartButton'

// ✅ Correct: import through public API
import { CartButton } from '@/features/shopping-cart'
```

### 1.4 Import Locality `[steiger]`

- **Within a slice:** use relative paths (`./`, `../`)
- **Between slices/layers:** use absolute paths (`@/`)

```ts
// ❌ Violation: absolute path inside own slice
import { cartReducer } from '@/features/shopping-cart/model/reducer'

// ✅ Correct: relative path inside own slice
import { cartReducer } from '../model/reducer'

// ❌ Violation: relative path to another slice
import { Product } from '../../../entities/product'

// ✅ Correct: absolute path to another slice
import { Product } from '@/entities/product'
```

### 1.5 Segments by Purpose `[steiger]`

Segment folders inside slices must reflect functional purpose. Generic technical names are forbidden.

```
❌ Forbidden segment names: utils/, hooks/, helpers/, components/, types/

✅ Allowed segment names: ui/, model/, api/, lib/, config/
```

---

## 2. React & TypeScript Rules

### 2.1 Named Exports Only `[eslint]`

`export default` is forbidden. Use named exports exclusively.

```ts
// ❌ Violation
export default function CartPage() { ... }

// ✅ Correct
export const CartPage = () => { ... }
```

**Exceptions:** `vite.config.ts`, `tailwind.config.ts`, and `React.lazy` dynamic imports.

### 2.2 Single Responsibility per Component File `[eslint]`

A file that exports a React component must not export anything else (functions, constants, types).

```ts
// ❌ Violation: component + helper in same file
export const formatPrice = (price: number) => `$${price}`
export const ProductCard = () => <div>...</div>

// ✅ Correct: component only
export const ProductCard = () => <div>...</div>
// Move formatPrice to model/ or lib/ segment
```

### 2.3 No Nested Component Declarations `[eslint]`

Components must not be declared inside the render body of other components.

```tsx
// ❌ Violation: new function reference on every render
export const ProductList = () => {
  const Item = ({ name }: { name: string }) => <li>{name}</li>
  return (
    <ul>
      <Item name="Phone" />
    </ul>
  )
}

// ✅ Correct: declare outside
const Item = ({ name }: { name: string }) => <li>{name}</li>

export const ProductList = () => {
  return (
    <ul>
      <Item name="Phone" />
    </ul>
  )
}
```

---

## 3. Styling Rules

### 3.1 Utility-First `[prettier]`

Use Tailwind utility classes directly in JSX. Avoid `@apply` except in global base styles (`index.css`).

```tsx
// ❌ Violation: custom CSS class
<button className="cart-button">Add</button>

// ✅ Correct: Tailwind utilities
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white">Add</button>
```

Class order is enforced automatically by `prettier-plugin-tailwindcss`.

### 3.2 Zero-Trust Styling for Custom shared/ui `[eslint]`

Custom components in `shared/ui/` must NOT use `className` JSX attribute. All styling is internal — consumers control appearance through variant/size props only.

**Directory split enforces the boundary:**

```
src/shared/ui/
├── shadcn/          ← shadcn library components (className allowed, managed by cva)
│   └── button.tsx
├── MyCustom.tsx     ← our components (className FORBIDDEN by ESLint)
└── index.ts
```

shadcn components retain `className` by design (merged via `cn()` + `cva`). The variant/size pattern enforced by `cva` + TypeScript types is the harness for these components.

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

**Why:** An open `className` lets AI agents (and developers) inject layout-breaking utilities into an encapsulated component. Variant props create a strict, type-checked contract.

### 3.3 Component Does Not Control Its Own Layout `[review]`

A component must not set external positioning styles (`margin`, `position: absolute`, `grid-column`, etc.) on its own root element. The parent decides where the component sits.

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

### 3.4 Escape Hatches via Composition, Not Styles `[review]`

When a component needs customization, use slots (children/render props), not style overrides.

```tsx
// ❌ Violation: style override
<Card className="border-red-500" />

// ✅ Correct: composition
<Card header={<AlertBanner />}>
  <ErrorContent />
</Card>
```

---

## 4. Structural Rules

### 4.1 Every Slice Has a Public API `[ci-custom]`

Every slice directory must contain an `index.ts` file.

```
❌ src/features/shopping-cart/  (no index.ts)
✅ src/features/shopping-cart/index.ts
```

Enforced by `validate-architecture.ts` (Day 5).

### 4.2 Architecture Graph Matches Imports `[ci-custom]`

The dependency graph in `ARCHITECTURE.md` must match actual imports in the codebase. Any divergence fails CI.

Enforced by `validate-architecture.ts` (Day 5).

---

## Enforcement

| Tag           | Tool                       | When                   |
| ------------- | -------------------------- | ---------------------- |
| `[steiger]`   | Steiger FSD linter         | `npm run lint:arch`    |
| `[eslint]`    | ESLint 9 flat config       | `npm run lint`         |
| `[prettier]`  | Prettier + TW plugin       | `npm run format:check` |
| `[review]`    | Code review (manual)       | PR review              |
| `[ci-custom]` | `validate-architecture.ts` | CI pipeline (Day 5)    |

All commands must exit with code 0. Warnings are treated as errors.
