---
name: story-first-ui
description: Story-first component development with CSF3, MSW, and Vitest Browser Mode. Use for any component in src/shared/ui/ or any component that needs visual regression or interaction testing.
---

# Story-First UI Development

## When to Use

- `src/shared/ui/**`
- Any component that needs visual regression or interaction testing
- Any bug reproduction in UI components

## Workflow

1. Write `ComponentName.stories.tsx` FIRST — define Default + all variants/sizes/states
2. Use CSF3: `export default satisfies Meta<typeof Component>`
3. Write the component to satisfy the stories
4. Stories stay forever — they are regression guards, not temporary tests

## Interaction Testing

Use the `play` function in stories for interactions (focus, dropdowns, form filling). Do not write separate `.spec.ts` files for UI interactions — they are tested via Vitest Browser Mode.

## Bug-First Workflow

When fixing a bug in `shared/ui/`:

1. Reproduce the bug as a story (e.g., `ButtonOverflow.stories.tsx`)
2. Verify the story shows the bug
3. Fix the component
4. The reproduction story stays as a regression guard — never delete it

## Determinism Rule

Stories MUST NOT rely on real network requests or random data (`Math.random()`, `Date.now()`). Use MSW `parameters.msw.handlers` for API mocking.

## References

- [CSF3 Format](./references/csf3-format.md)
- [MSW Mocking](./references/msw-mocking.md)
- [Vitest Browser Mode](./references/vitest-browser-mode.md)
- [Deterministic Mocking](./references/deterministic-mocking.md)
