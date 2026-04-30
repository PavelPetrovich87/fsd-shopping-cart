# Vitest Browser Mode

UI interactions are tested via Vitest Browser Mode with Playwright, not separate `.spec.ts` files.

## Configuration

- `storybookTest()` plugin in `vite.config.ts`
- `playwright({})` provider, `headless: true`, `chromium`

## Running Storybook

```bash
npx storybook dev -p 6006 --no-open
```

## When to Use Browser Mode

- Focus states
- Dropdown interactions
- Form filling
- Any interaction that requires a real DOM

Do not write separate `.spec.ts` files for these interactions.
