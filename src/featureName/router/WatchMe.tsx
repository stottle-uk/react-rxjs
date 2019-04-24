import React, { Component } from 'react';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { router, RouterContext } from '../../dataService';
import { PageEntry } from '../models/pageEntry';

interface WatchMeProps {
  container: (
    page: React.ComponentType<PageEntry>,
    data: PageEntry
  ) => JSX.Element;
}

interface WatchMeState {
  // data: PageEntry;
  template: JSX.Element;
}

class WatchMe extends Component<WatchMeProps, WatchMeState> {
  destory$ = new Subject();

  componentDidMount(): void {
    router.activedRoute$
      .pipe(
        takeUntil(this.destory$),
        switchMap(route =>
          route.data(route.path).pipe(
            map(pageData => ({
              template: this.props.container(route.template, pageData)
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
        value={{
          go: router.go.bind(router)
        }}
      >
        {this.state.template}
      </RouterContext.Provider>
    ) : (
      <div>waiting</div>
    );
  }
}

export default WatchMe;
