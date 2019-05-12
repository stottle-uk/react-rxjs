import React from 'react';
import { RouterOutletConsumer } from './RouterContext';

const RouterOutlet = <T extends {}>(props: T) => {
  return (
    <RouterOutletConsumer>
      {context => <context.element {...props} />}
    </RouterOutletConsumer>
  );
};

export default RouterOutlet;
