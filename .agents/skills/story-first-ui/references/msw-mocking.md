# MSW Mocking

Mock network requests in stories using MSW handlers in story parameters.

```tsx
import { http, HttpResponse } from 'msw'

export const WithApiData: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/products', () => HttpResponse.json(mockProducts)),
      ],
    },
  },
}
```

## Imports

- `msw` for `http` and `HttpResponse`
- `msw-storybook-addon` for Storybook integration

## Rule

Every story that depends on network data MUST define its own MSW handlers. Do not rely on global mock state.
