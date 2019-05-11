import React, { Component } from 'react';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { HistoryConsumer, RouterOutletProvider } from './RouterContext';
import { BrowserHistory } from './services/BrowserHistory';
import { BrowserRouter } from './services/BrowserRouter';
import { RouterConfigRoute } from './types/router';

interface RouterProps<T> {
  router: BrowserRouter<T>;
  children: React.ReactNode;
  onRouteFound: (route: RouterConfigRoute<T>) => void;
}

export const Router = <T extends {}>(props: RouterProps<T>) => {
  const { router, onRouteFound, children } = props;
  return (
    <HistoryConsumer>
      {({ history }) => (
        <HistoryOutlet
          router={router}
          history={history}
          onRouteFound={onRouteFound}
        >
          {children}
        </HistoryOutlet>
      )}
    </HistoryConsumer>
  );
};

export default Router;

interface HistoryOutletProps<T> extends RouterProps<T> {
  history: BrowserHistory;
}

interface HistoryOutletState<T> {
  element: React.ComponentType<T>;
}

class HistoryOutlet<T> extends Component<
  HistoryOutletProps<T>,
  HistoryOutletState<T>
> {
  destory$ = new Subject();

  componentDidMount(): void {
    const { history, router, onRouteFound } = this.props;

    history.activatedPath$
      .pipe(
        takeUntil(this.destory$),
        map(path => router.matchRoute(path)),
        tap(route => onRouteFound(route)),
        map(route => ({
          element: route.template
        })),
        tap(state => this.setState(state))
      )
      .subscribe();
  }

  componentWillUnmount(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  render() {
    return (
      <RouterOutletProvider children={this.props.children} value={this.state} />
    );
  }
}
