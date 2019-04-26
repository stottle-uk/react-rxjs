import React, { Component } from 'react';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RouterProvider } from './RouterContext';
import { BrowserRouter } from './services/BrowserRouter';

interface WatchMeProps<T> {
  router: BrowserRouter<T>;
}

interface WatchMeState<T> {
  element: React.ComponentType<T>;
  data: T;
}

class Router<T> extends Component<WatchMeProps<T>, WatchMeState<T>> {
  destory$ = new Subject();

  componentDidMount(): void {
    this.props.router.activedRoute$
      .pipe(
        takeUntil(this.destory$),
        switchMap(route =>
          route.data(route.path).pipe(
            map(pageData => ({
              element: route.template,
              data: pageData
            })),
            tap(state => this.setState(state))
          )
        )
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
