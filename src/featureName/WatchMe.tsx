import React, { Component } from 'react';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import HomePage from './HomePage';
import * as testData from './homePageData';
import OtherPage from './OtherPage';
import { PageEntry } from './Testdata';

interface WatchMeProps {
  defaultPage: string;
  location: string;
}

interface WatchMeState {
  data: PageEntry;
  template: React.ComponentType<PageEntry>;
}

class WatchMe extends Component<WatchMeProps, WatchMeState> {
  destory$ = new Subject();
  location$ = new Subject<string>();

  componentDidMount(): void {
    this.location$
      .pipe(
        takeUntil(this.destory$),
        switchMap(location =>
          this.getPageEntryData(location).pipe(
            map(pageEntryData => ({
              data: pageEntryData,
              template: this.getTemplate(location)
            })),
            tap(state => this.setState(state))
          )
        )
      )
      .subscribe();

    this.location$.next(this.props.location);
  }

  componentDidUpdate(prevProps: Readonly<WatchMeProps>): void {
    if (prevProps.location !== this.props.location) {
      this.location$.next(this.props.location);
    }
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

  private getTemplate(location: string): React.ComponentType<PageEntry> {
    if (!location) {
      return templateData[this.props.defaultPage];
    }

    const data = templateData[location];
    if (data) {
      return data;
    }

    return templateData.home;
  }

  private getPageEntryData(location: string): Observable<PageEntry> {
    if (!location) {
      return of(routeData[this.props.defaultPage]);
    }

    const data = routeData[location];
    if (data) {
      return of(data);
    }

    return of();
  }
}

export default WatchMe;

const routeData: { [hey: string]: PageEntry } = {
  home: testData.homePageData,
  other: testData.otherPageData
};

const templateData: { [hey: string]: React.ComponentType<PageEntry> } = {
  home: HomePage,
  other: OtherPage
};
