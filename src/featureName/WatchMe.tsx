import React, { Component } from 'react';
import { ReplaySubject, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, mergeMap, tap } from 'rxjs/operators';
import WatchMeView from './WatchMeView';

interface WatchMeProps {
  interval: number;
  location: string;
}

interface WatchMeState {
  data: any;
}

function ATest(): any {
  return <div>ftikkj</div>;
}

class WatchMe extends Component<WatchMeProps, WatchMeState> {
  destory$ = new Subject();
  location$ = new ReplaySubject<string>();

  componentDidMount(): void {
    this.location$.next(this.props.location);
    this.location$
      .pipe(
        mergeMap((data, i) =>
          ajax('https://randomuser.me/api/?results=5').pipe(
            map(response => response.response.results),
            tap(results =>
              this.setState({
                data: results
              })
            )
          )
        )
      )
      .subscribe();
  }

  componentDidUpdate(prevProps: Readonly<WatchMeProps>, prevState: Readonly<WatchMeState>): void {
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
      <div>
        <WatchMeView item={this.state.data} render={data => <ATest />} />
      </div>
    ) : (
      <div>waiting</div>
    );
  }
}

export default WatchMe;
