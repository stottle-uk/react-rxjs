import React, { useContext, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
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
  const [element, setElement] = useState<HistoryOutletState<T>>();

  useEffect(() => {
    const destory$ = new Subject();
    const { history, router } = props;

    history.activatedPath$
      .pipe(
        map(path => router.matchRoute(path)),
        map(route => ({
          element: route.template
        })),
        tap(state => setElement(state))
      )
      .subscribe();

    return () => {
      destory$.next();
      destory$.complete();
    };
  }, []);

  return element ? (
    <RouterOutletProvider children={props.children} value={element.element} />
  ) : (
    <span />
  );
};
