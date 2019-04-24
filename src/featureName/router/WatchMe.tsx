import React, { Component } from 'react';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { router, RouterContext, RouterContextI } from '../../dataService';

interface WatchMeProps {}

interface WatchMeState extends RouterContextI {}

class WatchMe extends Component<WatchMeProps, WatchMeState> {
  destory$ = new Subject();

  componentDidMount(): void {
    router.activedRoute$
      .pipe(
        takeUntil(this.destory$),
        switchMap(route =>
          route.data(route.path).pipe(
            map(pageData => ({
              go: router.go.bind(router),
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
      <RouterContext.Provider
        children={this.props.children}
        value={this.state}
      />
    ) : (
      <div>waiting</div>
    );
  }
}

export default WatchMe;
