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
  tap
} from 'rxjs/operators';
import { List } from '../../pageData/models/pageEntry';
import './P2TemplateEntry.css';

type mapFn = <T, TOut>(
  project: (value: T, index: number) => Observable<TOut>
) => OperatorFunction<T, TOut>;

interface State {
  message: {
    [exha: string]: string;
  };
  interval: number;
  retryWait: (retryCount: number) => number;
}

class CS1TemplateEntry extends React.Component<List, State> {
  state: State = {
    message: {
      switchMap: 'not started'
    },
    interval: 3000,
    retryWait: count => 1000 * count
  };

  componentDidMount(): void {
    this.startInterval(switchMap, 'switchMap').subscribe();
    this.startInterval(mergeMap, 'mergeMap').subscribe();
    this.startInterval(concatMap, 'concatMap').subscribe();
    this.startInterval(exhaustMap, 'exhaustMap').subscribe();
  }

  private startInterval(mapFn: mapFn, key: string): Observable<string> {
    return interval(this.state.interval).pipe(
      tap(count => this.setMessage(key, `Getting ${count}`)),
      mapFn(url =>
        this.getHttpData(url, key).pipe(catchError(error => of(`${error}`)))
      ),
      tap(response => this.setMessage(key, response))
    );
  }

  private getHttpData(url: number, key: string): Observable<string> {
    return this.getDataFromSource(url).pipe(
      retryWhen(errors =>
        errors.pipe(
          tap(error => this.setMessage(key, `--- reponse: ${url} ${error}`)),
          scan(errorCount => ++errorCount, 0),
          tap(retryCount =>
            this.setMessage(key, `--- retry: ${url} retry count ${retryCount}`)
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

  private setMessage(key: string, message: string): void {
    this.setState({
      ...this.state.message,
      message: { [key]: `${this.state.message[key]}\n${key}: ${message}` }
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
        <pre>{this.state.message.switchMap}</pre>
      </div>
    );
  }
}

export default CS1TemplateEntry;
