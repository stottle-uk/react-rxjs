import React, { useContext } from 'react';
import { routerOutletContext } from './RouterContext';

const RouterOutlet = <T extends {}>(props: T) => {
  const Element = useContext<React.ComponentType<T>>(routerOutletContext);
  return <Element {...props} />;
};

export default RouterOutlet;
