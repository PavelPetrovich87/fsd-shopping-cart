# ESLint Domain Rules

## Plain Objects Only — No Classes

ESLint rule forbidding `ClassDeclaration` and `ClassExpression` in the domain layer:

```js
{
  files: ['src/entities/**/*.{ts,tsx}', 'src/features/**/model/**/*.{ts,tsx}'],
  ignores: ['src/entities/coupon/model/coupon.ts'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ClassDeclaration',
        message: 'Classes are forbidden in entities/ and features/**/model/. Use factory functions + plain objects.',
      },
      {
        selector: 'ClassExpression',
        message: 'Classes are forbidden in entities/ and features/**/model/. Use factory functions + plain objects.',
      },
    ],
  },
}
```

## Scope

- **Enforced:** `src/entities/**/*.ts`, `src/features/**/model/**/*.ts`
- **Exception:** `src/entities/coupon/model/coupon.ts` (legacy exception)
- **Out of scope:** `src/shared/lib/` — classes like `Money` are permitted here because it is pure infrastructure, not domain modeling

See `eslint.config.js` lines 99-118 for the live configuration.
