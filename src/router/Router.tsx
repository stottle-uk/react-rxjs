import React, { useContext, useEffect, useState } from 'react';
import { tap } from 'rxjs/operators';
import { HistoryContext } from './RouterContext';
import RouterOutlet from './RouterOutlet';

interface RouterProps<T> {
  routeData: T;
  children: React.ReactElement;
}

export const Router = <T extends {}>({
  children,
  routeData
}: RouterProps<T>) => {
  const history = useContext(HistoryContext);
  const [path, setPath] = useState<string>();

  const routerListenerEffect = () => {
    const subscription = history.activatedPath$
      .pipe(tap(state => setPath(state)))
      .subscribe();
    return () => subscription.unsubscribe();
  };

  useEffect(routerListenerEffect, []);

  return path ? (
    <RouterOutlet routeData={routeData} path={path} children={children} />
  ) : (
    <span />
  );
};

export default Router;
