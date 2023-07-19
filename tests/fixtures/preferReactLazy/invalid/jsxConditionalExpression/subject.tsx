import React from 'react';
import { Foo } from './Foo';

export default () => {
  return <>
    {Math.random() > 0.5 ? <Foo /> : null}
  </>;
};