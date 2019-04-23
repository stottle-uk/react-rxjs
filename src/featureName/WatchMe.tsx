import React, { Component } from 'react';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AppRouter } from './AppRouter';
import { PageEntry } from './Testdata';

interface WatchMeProps {
  router: AppRouter<PageEntry>;
}

interface WatchMeState {
  data: PageEntry;
  template: React.ComponentType<PageEntry>;
}

class WatchMe extends Component<WatchMeProps, WatchMeState> {
  destory$ = new Subject();

  componentDidMount(): void {
    this.props.router.activedRoute$
      .pipe(
        takeUntil(this.destory$),
        switchMap(route =>
          route.data(route.path).pipe(
            map(pageData => ({
              data: pageData,
              template: route.template
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
      <this.state.template {...this.state.data} />
    ) : (
      <div>waiting</div>
    );
  }
}

export default WatchMe;
