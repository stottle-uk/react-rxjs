import React from 'react';
import { interval, Observable, of, throwError, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  delayWhen,
  retryWhen,
  scan,
  tap
} from 'rxjs/operators';
import { List } from '../../pageData/models/pageEntry';
import './P2TemplateEntry.css';

interface State {
  message: string;
  interval: number;
  retryWait: (retryCount: number) => number;
}

class CS1TemplateEntry extends React.Component<List, State> {
  state: State = {
    message: 'not statrted',
    interval: 3000,
    retryWait: count => 1000 * count
  };

  componentDidMount(): void {
    this.startInterval();
  }

  private startInterval() {
    interval(this.state.interval)
      .pipe(
        tap(count => this.setMessage(`Getting ${count}`)),
        concatMap(url =>
          this.getHttpData(url).pipe(catchError(error => of(`${error}`)))
        ),
        tap(response => this.setMessage(response))
      )
      .subscribe();
  }

  private getHttpData(url: number): Observable<string> {
    return this.getDataFromSource(url).pipe(
      retryWhen(errors =>
        errors.pipe(
          tap(error => this.setMessage(`--- reponse: ${url} ${error}`)),
          scan(errorCount => ++errorCount, 0),
          tap(retryCount =>
            this.setMessage(`--- retry: ${url} retry count ${retryCount}`)
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

  private setMessage(message: string): void {
    this.setState({
      message: `${this.state.message}\n${message}`
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
        <pre>{this.state.message}</pre>
      </div>
    );
  }
}

export default CS1TemplateEntry;
