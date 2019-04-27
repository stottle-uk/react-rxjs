import React, { Component } from 'react';
import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RouterProvider } from './RouterContext';
import { BrowserRouter } from './services/BrowserRouter';

interface WatchMeProps<T> {
  router: BrowserRouter<T>;
  getRouteData: (path: string) => Observable<T>;
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
        filter(route => !!route),
        switchMap(route =>
          this.props.getRouteData(route.path).pipe(
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
