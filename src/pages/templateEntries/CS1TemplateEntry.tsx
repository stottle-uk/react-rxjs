import React from 'react';
import {
  interval,
  merge,
  Observable,
  of,
  OperatorFunction,
  Subject,
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
  takeUntil,
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
  destory$ = new Subject();
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

  componentWillUnmount(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  startTimers(): void {
    merge(
      this.startInterval(switchMap, switchMap.name),
      this.startInterval(mergeMap, mergeMap.name),
      this.startInterval(concatMap, concatMap.name),
      this.startInterval(exhaustMap, exhaustMap.name)
    )
      .pipe(takeUntil(this.destory$))
      .subscribe();
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
    return getDataFromSource(url).pipe(
      retryWhen(errors =>
        errors.pipe(
          scan(errorCount => ++errorCount, 0),
          tap(retryCount =>
            this.log(key, `-- retry: ${url} retry count ${retryCount}`)
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

  render() {
    return (
      <div>
        <h1>Transformation Map Operators</h1>
        <button onClick={this.startTimers.bind(this)}>start</button>
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

function getDataFromSource(url: number): Observable<string> {
  if (url % 3) {
    return throwError(`Error http ${url}`).pipe(delay(3000));
  }
  return of(`Good http ${url}`).pipe(delay(1000));
}
