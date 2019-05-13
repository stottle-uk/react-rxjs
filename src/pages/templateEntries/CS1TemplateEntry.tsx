import React from 'react';
import {
  interval,
  Observable,
  of,
  OperatorFunction,
  throwError,
  timer
} from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  delayWhen,
  exhaustMap,
  mergeMap,
  retryWhen,
  scan,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { List } from '../../pageData/models/pageEntry';
import './P2TemplateEntry.css';

type mapFn = <T, TOut>(
  project: (value: T, index: number) => Observable<TOut>
) => OperatorFunction<T, TOut>;

interface State {
  message: {
    [key: string]: string;
  };
  interval: number;
  retryWait: (retryCount: number) => number;
}

class CS1TemplateEntry extends React.Component<List, State> {
  state: State = {
    message: {
      switchMap: 'switchMap',
      mergeMap: 'mergeMap',
      concatMap: 'concatMap',
      exhaustMap: 'exhaustMap'
    },
    interval: 3000,
    retryWait: count => 1000 * count
  };

  componentDidMount(): void {
    this.startInterval(switchMap, switchMap.name).subscribe();
    this.startInterval(mergeMap, mergeMap.name).subscribe();
    this.startInterval(concatMap, concatMap.name).subscribe();
    this.startInterval(exhaustMap, exhaustMap.name).subscribe();
  }

  private startInterval(mapFn: mapFn, key: string): Observable<string> {
    return interval(this.state.interval).pipe(
      take(10),
      tap(count => this.log(key, `Getting ${count}`)),
      mapFn(url =>
        this.getHttpData(url, key).pipe(catchError(error => of(`${error}`)))
      ),
      tap(response => this.log(key, response))
    );
  }

  private getHttpData(url: number, key: string): Observable<string> {
    return this.getDataFromSource(url).pipe(
      retryWhen(errors =>
        errors.pipe(
          scan(errorCount => ++errorCount, 0),
          tap(retryCount =>
            this.log(key, `--- retry: ${url} retry count ${retryCount}`)
          ),
          delayWhen(retryCount =>
            retryCount < 4
              ? timer(this.state.retryWait(retryCount))
              : throwError(`${url} failed with ${retryCount} retries`)
          )
        )
      )
    );
  }

  private log(key: string, message: string): void {
    this.setState({
      message: {
        ...this.state.message,
        [key]: `${this.state.message[key]}\n${message}`
      }
    });
  }

  private getDataFromSource(url: number): Observable<string> {
    console.log(url);

    if (!(url % 3)) {
      return of(`Good http ${url}`).pipe(delay(1000));
    }
    return throwError(`Error http ${url}`).pipe(delay(3000));
  }

  render() {
    return (
      <div>
        <h1>Transformation Map Operators</h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {Object.values(this.state.message).map((val, i) => (
            <pre
              key={i}
              style={{
                width: '25%'
              }}
            >
              {val}
            </pre>
          ))}
        </div>
      </div>
    );
  }
}

export default CS1TemplateEntry;
