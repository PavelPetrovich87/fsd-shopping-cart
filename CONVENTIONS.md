# Conventions

Machine-enforceable rules only. Every rule is binary (violated or not), syntax-verifiable, and locally checkable.

Subjective guidelines ("keep functions small", "write clean code") are explicitly excluded.

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

## Enforcement

| Tag           | Tool                       | When                                     |
| ------------- | -------------------------- | ---------------------------------------- |
| `[steiger]`   | Steiger FSD linter         | `npm run lint:arch`                      |
| `[eslint]`    | ESLint 9 flat config       | `npm run lint`                           |
| `[prettier]`  | Prettier + TW plugin       | `npm run format:check`                   |
| `[review]`    | Code review (manual)       | PR review                                |
| `[ci-custom]` | `validate-architecture.ts` | CI pipeline (Day 5)                      |
| `[git-hook]`  | Husky hooks                | pre-commit / pre-merge / push            |
| `[storybook]` | `npm run test:storybook`   | Story rendering + interaction            |
| `[a11y]`      | Storybook a11y addon       | `test: 'error'` — CI fails on violations |
| `[msw]`       | Storybook preview MSW      | Network mocking in stories               |
| `[visual]`    | Chromatic                  | Cloud visual regression                  |

### Git Hooks

| Hook               | Runs                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| `pre-commit`       | `lint-staged` (lint + format on changed files)                             |
| `pre-merge-commit` | `npm run lint && npm run lint:arch && npm run build`                       |
| `pre-push`         | `lint:arch && validate:arch && build && build-storybook && test:storybook` |

The `pre-merge-commit` hook is the **merge gate** — it prevents broken code from landing in `main` even if a reviewing agent approves without running checks.

All commands must exit with code 0. Warnings are treated as errors.

---

## Skill References

For detailed rules on specific topics, see the following skills:

| Topic                                           | Skill                           |
| ----------------------------------------------- | ------------------------------- |
| FSD architecture, layers, imports               | `fsd-architecture`              |
| Domain modeling (Plain Objects, Events, Ports)  | `domain-modeling-plain-objects` |
| Story-first component development               | `story-first-ui`                |
| UI styling constraints (Tokens, shadcn, Layout) | `fsd-ui-styling-constraints`    |
| Tailwind v4 design system                       | `tailwind-design-system`        |
