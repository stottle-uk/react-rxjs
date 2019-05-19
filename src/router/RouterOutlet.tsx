import React, { useContext } from 'react';
import { RouterContext } from './RouterContext';

interface RouterOutletState<T> {
  path: string;
  routeData: T;
  children: React.ReactElement;
}

const RouterOutlet = <T extends {}>({
  path,
  routeData,
  children
}: RouterOutletState<T>) => {
  const router = useContext(RouterContext);
  const route = router.matchRoute(path);
  return route ? <route.template {...routeData} /> : children;
};

export default RouterOutlet;
