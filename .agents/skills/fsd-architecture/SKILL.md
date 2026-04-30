---
name: fsd-architecture
description: Feature-Sliced Design methodology for frontend projects. Covers layer hierarchy, import rules, public API conventions, segment naming, and Steiger CI setup. Use when editing any file in src/.
---

# FSD Architecture

This skill defines the Feature-Sliced Design (FSD) methodology used in this project.

## When to Use

- Any file in `src/`
- Creating new slices, segments, or layers
- Reviewing imports for architectural violations
- Configuring or troubleshooting Steiger

## Layer Hierarchy

Dependencies flow DOWN only.

```
app → pages → widgets → features → entities → shared
```

| Layer      | Responsibility                             | May import from                            |
| ---------- | ------------------------------------------ | ------------------------------------------ |
| `app`      | Providers, routing, global styles          | pages, widgets, features, entities, shared |
| `pages`    | Route-level composition                    | widgets, features, entities, shared        |
| `widgets`  | Self-contained UI blocks                   | features, entities, shared                 |
| `features` | User interactions with business logic      | entities, shared                           |
| `entities` | Business objects and data shapes           | shared                                     |
| `shared`   | Reusable, business-agnostic infrastructure | nothing (leaf layer)                       |

## Import Rules

| Rule                    | Summary                                                                                                        | Example of violation                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| No higher-level imports | A module may only import from layers **below** it                                                              | `entities/` importing from `features/`             |
| No cross-slice imports  | Slices within the same layer cannot import from each other (except `shared` cross-segment)                     | `features/cart` importing from `features/wishlist` |
| Public API only         | All cross-boundary imports must go through the slice's `index.ts`                                              | `import { X } from '@/features/cart/ui/Button'`    |
| Import locality         | Relative paths inside own slice; absolute paths between slices                                                 | `import { X } from '../../entities/product'`       |
| Segments by purpose     | Use `ui/`, `model/`, `api/`, `lib/`, `config/` — never `utils/`, `hooks/`, `helpers/`, `components/`, `types/` | `utils/` folder inside a slice                     |

## Segment Naming

Allowed segments inside a slice: `ui/`, `model/`, `api/`, `lib/`, `config/`

Forbidden segment names: `utils/`, `hooks/`, `helpers/`, `components/`, `types/`

## Per-Layer Directives

For full per-layer goals, content, directives, and common mistakes, see [references/layer-directives.md](./references/layer-directives.md).

## Detailed References

- [Layer Directives](./references/layer-directives.md) — Full rules for each FSD layer
- [Import Rules](./references/import-rules.md) — Code examples for all import patterns
- [Segment Naming](./references/segment-naming.md) — Allowed vs forbidden segment names
- [Steiger & CI Setup](./references/steiger-ci-setup.md) — FSD linter configuration and validation
