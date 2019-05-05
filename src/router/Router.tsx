import React, { Component } from 'react';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { RouterProvider } from './RouterContext';
import { BrowserRouter } from './services/BrowserRouter';
import { RouterConfigRoute } from './types/router';

interface WatchMeProps<T> {
  router: BrowserRouter<T>;
  onRouteChange: (path: RouterConfigRoute<T>) => void;
}

interface WatchMeState<T> {
  element: React.ComponentType<T>;
}

class Router<T> extends Component<WatchMeProps<T>, WatchMeState<T>> {
  destory$ = new Subject();

  componentDidMount(): void {
    this.props.router.activedRoute$
      .pipe(
        takeUntil(this.destory$),
        tap(route => this.props.onRouteChange(route)),
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
      <RouterProvider
        children={this.props.children}
        value={{
          go: this.props.router.go.bind(this.props.router),
          ...this.state
        }}
      />
    ) : (
      <div>waiting</div>
    );
  }
}

export default Router;
