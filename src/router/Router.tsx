import React, { useContext, useEffect, useState } from 'react';
import { tap } from 'rxjs/operators';
import { HistoryContext } from './RouterContext';
import RouterOutlet from './RouterOutlet';

export const Router = <T extends {}>(props: T) => {
  const history = useContext(HistoryContext);
  const [path, setPath] = useState<string>();

  const routerListenerEffect = () => {
    const subscription = history.activatedPath$
      .pipe(tap(state => setPath(state)))
      .subscribe();
    return () => subscription.unsubscribe();
  };

  useEffect(routerListenerEffect, []);

  return path ? <RouterOutlet pageData={props} path={path} /> : <span />;
};

export default Router;
