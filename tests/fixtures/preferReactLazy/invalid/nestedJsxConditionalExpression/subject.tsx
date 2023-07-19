import React from 'react';
import { Foo } from './Foo';

export default () => {
  return <>
    {Math.random() > 0.5 ? <div>
      <Foo />
    </div> : null}
  </>;
};