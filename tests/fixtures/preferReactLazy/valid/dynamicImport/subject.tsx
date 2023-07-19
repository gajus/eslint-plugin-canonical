import React, { lazy } from 'react';

const Foo = lazy(() => import('./Foo').then(({ Foo }) => ({ default: Foo })));

export default () => {
  return Math.random() > 0.5 ? <Foo /> : null;
};