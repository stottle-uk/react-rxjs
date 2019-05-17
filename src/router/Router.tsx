import React, { useContext, useEffect, useState } from 'react';
import { map, tap } from 'rxjs/operators';
import { ActivatedPathContext, HistoryContext } from './RouterContext';

interface RouterProps {
  children: React.ReactNode;
}

interface RouterState {
  path: string;
}

export const Router = (props: RouterProps) => {
  const { history } = useContext(HistoryContext);
  const [route, setRoute] = useState<RouterState>();

  const routerListenerEffect = () => {
    const subscription = history.activatedPath$
      .pipe(
        map(path => ({
          path
        })),
        tap(state => setRoute(state))
      )
      .subscribe();
    return () => subscription.unsubscribe();
  };

  useEffect(routerListenerEffect, []);

  return route ? (
    <ActivatedPathContext.Provider children={props.children} value={route} />
  ) : (
    <span />
  );
};

export default Router;
