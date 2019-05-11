import React, { Component } from 'react';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { RouterOutletProvider, RouterProvider } from './RouterContext';
import { BrowserHistory } from './services/BrowserHistory';
import { BrowserRouter } from './services/BrowserRouter';
import { RouterConfigRoute } from './types/router';

interface WatchMeProps<T> {
  history: BrowserHistory;
  router: BrowserRouter<T>;
  onRouteFound: (route: RouterConfigRoute<T>) => void;
}

interface WatchMeState<T> {
  element: React.ComponentType<T>;
}

class Router<T> extends Component<WatchMeProps<T>, WatchMeState<T>> {
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
    return this.state ? (
      <RouterProvider value={{ router: this.props.history }}>
        <RouterOutletProvider
          children={this.props.children}
          value={this.state}
        />
      </RouterProvider>
    ) : (
      <div>waiting</div>
    );
  }
}

export default Router;
