### `prefer-react-lazy`

Requires that components that can be loaded lazily be imported using the `React.lazy()` function.

```tsx
import { lazy } from 'react';
import { Foo } from './Foo';

export default () => {
  return Math.random() > 0.5 ? <Foo /> : null;
};
```

This rule converts the above code to:

```tsx
import { lazy } from 'react';

const Foo = lazy(() => import('./Foo.js').then(({ Foo }) => ({ default: Foo })));

export default () => {
  return Math.random() > 0.5 ? <Foo /> : null;
};
```

<!-- assertions preferReactLazy -->