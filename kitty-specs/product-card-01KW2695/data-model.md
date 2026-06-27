# Data Model: Product Card

**Mission**: product-card-01KW2695  
**Date**: 2026-06-26

## Entities

### ProductCard (UI Component)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `skuId` | `string` | Yes | Unique product identifier (used for key/alt text) |
| `name` | `string` | Yes | Product name displayed below the image |
| `imageUrl` | `string` | Yes | Product image URL |
| `listPriceCents` | `number` | Yes | Original price in cents (e.g., 5999 = $59.99) |
| `salePriceCents` | `number \| null` | No | Sale price in cents; if null, no sale is shown |
| `isLoading` | `boolean` | No | When true, render skeleton placeholders |

### Product (Fixture Data — from `shared/api/fixtures/products.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `skuId` | `string` | Unique identifier |
| `name` | `string` | Product name |
| `description` | `string` | Product description (not displayed in card) |
| `imageUrl` | `string` | Image URL |
| `listPriceCents` | `number` | Original price in cents |
| `salePriceCents` | `number \| null` | Sale price in cents |
| `category` | `string` | Product category (not displayed in card) |

## Relationships

- `ProductCard` receives a subset of `Product` fields as props.
- The wrapping page (HomePage, T-028) passes a `Product` object and maps it to `ProductCardProps`.

## State

- No internal state — pure presentational component.
- `isLoading` is a prop-driven state that renders a skeleton instead of product data.

## Value Objects

### Money Formatting

```typescript
type Cents = number;

function centsToDollars(cents: Cents): string {
  return `$${(cents / 100).toFixed(2)}`;
}
```

> **Note**: This is a simple formatting utility. If `Intl.NumberFormat` is preferred for localization, it can be substituted without changing the component interface.
