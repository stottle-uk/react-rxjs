import React, { useContext } from 'react';
import { RouterContext } from './RouterContext';

interface RouterOutletState<T> {
  path: string;
  pageData: T;
}

const RouterOutlet = <T extends {}>(props: RouterOutletState<T>) => {
  const router = useContext(RouterContext);
  const route = router.matchRoute(props.path);
  return <route.template {...props.pageData} />;
};

export default RouterOutlet;
