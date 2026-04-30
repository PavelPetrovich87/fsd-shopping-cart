# Steiger & CI Setup

## Steiger Configuration

Project config: `steiger.config.ts`

```ts
import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
])
```

> **Note:** The `fsd/insignificant-slice: 'off'` override is project-specific and must be preserved.

## Running Steiger

```bash
npm run lint:arch
```

This runs the Steiger FSD linter against the entire `src/` directory.

## CI Validation

`scripts/validate-architecture.ts` performs additional checks beyond Steiger:

1. **Undocumented dependency:** an import exists but the edge is missing from `ARCHITECTURE.md`
2. **Stale documentation:** an edge exists in `ARCHITECTURE.md` but no import backs it up

Run via:

```bash
npm run validate:arch
```

## Enforcement Tags

| Tag           | Command                 | What it checks                                                        |
| ------------- | ----------------------- | --------------------------------------------------------------------- |
| `[steiger]`   | `npm run lint:arch`     | FSD layer violations, cross-slice imports, public API usage           |
| `[ci-custom]` | `npm run validate:arch` | Architecture graph matches actual imports, every slice has `index.ts` |
