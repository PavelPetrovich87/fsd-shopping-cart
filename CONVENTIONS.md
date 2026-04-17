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

## 4. Domain Model Rules

### 4.1 Plain Objects Only — No Classes in Domain Layer `[eslint]`

Domain aggregates, entities, and value objects in `entities/` and `features/**/model/` MUST use the **Factory Functions + Plain Objects** pattern. ES6 classes are forbidden in these locations.

**Why:** Plain objects are natively serializable (JSON, structuredClone), work with React state (useState, Zustand) without wrapper hacks, and are transparent to devtools. Classes hide state behind `private` fields, break spread/destructuring, and require custom serialization.

**Required structure:**

```typescript
// 1. State — plain interface, all readonly
export interface Cart {
  readonly id: string
  readonly items: readonly CartItem[]
  readonly status: 'active' | 'checkout_pending' | 'checked_out'
}

// 2. Factory — pure function, validates invariants, returns plain object
export function createCart(id: string): Cart {
  return { id, items: [], status: 'active' }
}

// 3. Behavior — pure function, takes state, returns NEW state
export function addItem(cart: Cart, item: CartItem): Cart {
  return { ...cart, items: [...cart.items, item] }
}
```

**Anti-patterns (will be caught by ESLint):**

```typescript
// ❌ class declaration in entities/
export class Cart { ... }

// ❌ this-mutation
this.items.push(item)

// ❌ method call on instance
cart.addItem(item)
```

**Scope:** `src/entities/**/*.ts`, `src/features/**/model/**/*.ts`

**Out of scope:** `shared/lib/` (Value Objects like Money may use classes — preferred plain, but not enforced by linter).

### 4.2 Immutable State Transitions `[eslint]`

Behavioral functions in domain layer MUST return a new object. Direct mutation of input state is forbidden.

```typescript
// ❌ Violation: mutating input
export function addItem(cart: Cart, item: CartItem): Cart {
  cart.items.push(item) // mutation!
  return cart
}

// ✅ Correct: new object
export function addItem(cart: Cart, item: CartItem): Cart {
  return { ...cart, items: [...cart.items, item] }
}
```

### 4.3 Events as Data, Not Effects `[review]`

Domain functions in `entities/` and `features/**/model/` must not produce side effects. No calling callbacks, emitting events, dispatching actions, or reaching for external systems.

Instead, a state-changing function returns a **tuple**: new state + an array of domain events (plain objects describing what happened).

```typescript
// ❌ Violation: domain function triggers side effects
export function addItem(cart: Cart, item: CartItem, onAdd: () => void): Cart {
  onAdd() // callback = side effect
  bus.emit('ItemAdded', item) // event emitter = side effect
  return { ...cart, items: [...cart.items, item] }
}

// ✅ Correct: domain function returns facts, caller decides what to do with them
export function addItem(cart: Cart, item: CartItem): [Cart, CartEvent[]] {
  const newCart = { ...cart, items: [...cart.items, item] }
  return [newCart, [{ type: 'ItemAddedToCart', payload: { itemId: item.id } }]]
}
```

**Banned patterns** (any of these in domain files = violation):

- `.emit()`, `.dispatch()`, `.publish()`, `.notify()`, `.fire()`, `.trigger()`
- `.subscribe()`, `.on()`, `.addEventListener()`
- `new EventEmitter()`, `new EventTarget()`
- Invoking callback parameters (`onSuccess()`, `onChange()`, etc.)
- Direct `fetch` / HTTP calls

**Why:** The domain layer is a pure calculator — it computes new state and records facts. The `features/` orchestrator layer saves state to the store and routes events to whoever cares (analytics, notifications, dependent recalculations). This makes domain logic trivially testable: pass data in, assert on the returned tuple with `toEqual()`. No mocks, no spies.

**Scope:** `src/entities/**/*.ts`, `src/features/**/model/**/*.ts`

---

## 5. Structural Rules

### 5.1 Every Slice Has a Public API `[ci-custom]`

Every slice directory must contain an `index.ts` file.

```
❌ src/features/shopping-cart/  (no index.ts)
✅ src/features/shopping-cart/index.ts
```

Enforced by `npm run validate:arch` (`scripts/validate-architecture.ts`).

### 5.2 Architecture Graph Matches Imports `[ci-custom]`

The dependency graph in `ARCHITECTURE.md` must match actual imports in the codebase. Any divergence fails CI.

Two error types:

- **Undocumented dependency:** an import exists but the edge is missing from ARCHITECTURE.md
- **Stale documentation:** an edge exists in ARCHITECTURE.md but no import backs it up (source slice must not be empty)

Enforced by `npm run validate:arch` (`scripts/validate-architecture.ts`).

---

## 6. Design System & Styling Conventions

### 6.1 The Token Law (Strict Prohibition of Magic Values) `[eslint]`

- **NO ARBITRARY VALUES:** Do not use arbitrary Tailwind values for colors, spacing, typography, or radii (e.g., `text-[#FF5733]`, `w-[314px]`, `rounded-[10px]`).
- **Use Theme Variables:** Map visual properties to the CSS variables defined in the `@theme` block (e.g., `text-primary`, `w-80`, `rounded-md`).
- **Fallback Rule:** If a specific pixel value from Penpot does not exist in the Tailwind scale, use the closest available standard token. Do not invent a new one unless instructed.

### 6.2 Component Authority (shadcn/ui First) `[review]`

- **Do Not Reinvent Atoms:** For any base UI element (Button, Input, Dialog, Select, Card), use the pre-built `shadcn/ui` components located in `@/shared/ui`.
- **Prop Mapping:** Analyze the Penpot component state (e.g., "Variant: Outline", "State: Disabled") and map it to the corresponding shadcn `variant` or `size` props.
- **Extension, Not Modification:** If a shadcn component lacks a style present in Penpot, extend it via the `className` prop using the `cn()` utility. Do not rewrite the internal component logic.

### 6.3 Layout Translation (Penpot to Code) `[review]`

- **Flex/Grid Only:** Translate Penpot's Auto Layout strictly into CSS Flexbox or Grid.
- **Spacing:** Penpot "Gap" properties must translate to Tailwind `gap-*` utilities. Do NOT use margins (`mt-*`, `ml-*`) to separate items within an Auto Layout container.
- **Padding:** Match Penpot padding exactly using Tailwind `p-*`, `px-*`, `py-*` scales.

### 6.4 Color Semantics `[eslint]`

- Never use raw color names (e.g., `bg-blue-500`) in feature components.
- Use semantic roles: `bg-background`, `text-foreground`, `bg-primary`, `border-border`, `text-muted-foreground`.
- Ensure dark mode compatibility automatically by relying exclusively on these semantic variables.

### 6.5 Typography Strictness `[review]`

- Text styles from Penpot (e.g., "Heading 1", "Body Small") must be translated using standard Tailwind typography combos (e.g., `text-2xl font-bold tracking-tight` or `text-sm text-muted-foreground`).
- Do not use arbitrary line heights unless explicitly defined as a token.

---

## Enforcement

| Tag           | Tool                       | When                          |
| ------------- | -------------------------- | ----------------------------- |
| `[steiger]`   | Steiger FSD linter         | `npm run lint:arch`           |
| `[eslint]`    | ESLint 9 flat config       | `npm run lint`                |
| `[prettier]`  | Prettier + TW plugin       | `npm run format:check`        |
| `[review]`    | Code review (manual)       | PR review                     |
| `[ci-custom]` | `validate-architecture.ts` | CI pipeline (Day 5)           |
| `[git-hook]`  | Husky hooks                | pre-commit / pre-merge / push |

### Git Hooks

| Hook               | Runs                                                     |
| ------------------ | -------------------------------------------------------- |
| `pre-commit`       | `lint-staged` (lint + format on changed files)           |
| `pre-merge-commit` | `npm run lint && npm run lint:arch && npm run build`     |
| `pre-push`         | `lint:arch && validate:arch && build && build-storybook` |

The `pre-merge-commit` hook is the **merge gate** — it prevents broken code from landing in `main` even if a reviewing agent approves without running checks.

All commands must exit with code 0. Warnings are treated as errors.
