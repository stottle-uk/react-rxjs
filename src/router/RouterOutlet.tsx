import React, { useContext } from 'react';
import { ActivatedPathContext, RouterContext } from './RouterContext';

const RouterOutlet = <T extends {}>(props: T) => {
  const { router } = useContext(RouterContext);
  const { path } = useContext(ActivatedPathContext);
  const route = router.matchRoute(path);
  return <route.template {...props} />;
};

export default RouterOutlet;
