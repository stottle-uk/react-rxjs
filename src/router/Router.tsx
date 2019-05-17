import React, { useContext, useEffect, useState } from 'react';
import { map, tap } from 'rxjs/operators';
import { historyContext, RouterOutletProvider } from './RouterContext';
import { BrowserHistory } from './services/BrowserHistory';
import { BrowserRouter } from './services/BrowserRouter';

interface RouterProps<T> {
  router: BrowserRouter<T>;
  children: React.ReactNode;
}

export const Router = <T extends {}>(props: RouterProps<T>) => {
  const { history } = useContext(historyContext);
  const { router, children } = props;
  return (
    <HistoryOutlet router={router} history={history} children={children} />
  );
};

export default Router;

interface HistoryOutletProps<T> extends RouterProps<T> {
  history: BrowserHistory;
}

interface HistoryOutletState<T> {
  element: React.ComponentType<T>;
}

const HistoryOutlet = <T extends {}>(props: HistoryOutletProps<T>) => {
  const [route, setRoute] = useState<HistoryOutletState<T>>();

  const routeListener = () =>
    props.history.activatedPath$
      .pipe(
        map(path => props.router.matchRoute(path)),
        map(route => ({
          element: route.template
        })),
        tap(state => setRoute(state))
      )
      .subscribe();

  const routerListenerEffect = () => {
    const subscription = routeListener();
    return () => subscription.unsubscribe();
  };

  useEffect(routerListenerEffect, []);

  return route ? (
    <RouterOutletProvider children={props.children} value={route.element} />
  ) : (
    <span />
  );
};
