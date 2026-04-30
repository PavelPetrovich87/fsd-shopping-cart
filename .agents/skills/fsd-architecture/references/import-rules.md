# Import Rules

## 1. No Higher-Level Imports

A module may only import from layers **below** it in the hierarchy.

```ts
// ❌ Violation: entity importing from features (higher layer)
import { addToCart } from '@/features/shopping-cart'

// ✅ Correct: feature importing from entity (lower layer)
import { Product } from '@/entities/product'
```

## 2. No Cross-Slice Imports

Slices within the same layer cannot import from each other.

```ts
// ❌ Violation: feature importing from sibling feature
import { useWishlist } from '@/features/wishlist'

// ✅ Correct: move shared logic down to entities or shared
import { ProductCard } from '@/entities/product'
```

## 3. Public API Only

All cross-boundary imports must go through the slice's `index.ts`. Direct imports into internal folders are forbidden.

```ts
// ❌ Violation: reaching into internal structure
import { CartButton } from '@/features/shopping-cart/ui/CartButton'

// ✅ Correct: import through public API
import { CartButton } from '@/features/shopping-cart'
```

## 4. Import Locality

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

## 5. Segments by Purpose

Segment folders inside slices must reflect functional purpose. Generic technical names are forbidden.

```
❌ Forbidden segment names: utils/, hooks/, helpers/, components/, types/

✅ Allowed segment names: ui/, model/, api/, lib/, config/
```
