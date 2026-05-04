# Shared Lib — Agent Reference

This directory contains reusable utilities (functions, helpers, value objects) used across the project.

**When adding a new utility, register it in this file.**

## Utility Catalog

| Export                     | File                     | Purpose                                                                             | Example                                     |
| -------------------------- | ------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------- |
| `cn`                       | `utils.ts`               | Tailwind class merging via `clsx` + `tailwind-merge`                                | `cn('btn', isActive && 'btn-active')`       |
| `formControlBorder`        | `form-control-styles.ts` | Border styles for form control containers (disabled / default / error-focus states) | `formControlBorder({ disabled, hasError })` |
| `FormControlBorderOptions` | `form-control-styles.ts` | Options type for `formControlBorder`                                                | —                                           |
| `Money`                    | `money.ts`               | Value object for monetary amounts                                                   | `Money.fromCents(1000, 'USD')`              |

## Conventions

1. **Pure functions only** — no side effects, no React hooks.
2. **Re-export from `index.ts`** — every public utility must be exported in `index.ts`.
3. **Update this file** — add a row to the catalog above when creating a new utility.
4. **JSDoc for complex logic** — if a utility has non-obvious behavior, add a JSDoc block with `@example`.
