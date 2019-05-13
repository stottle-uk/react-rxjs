import React from 'react';
import { interval, merge, of, Subject } from 'rxjs';
import { catchError, finalize, map, takeWhile, tap } from 'rxjs/operators';
import { List } from '../../pageData/models/pageEntry';
import './P2TemplateEntry.css';

interface State {
  message: string[];
}

class LH1TemplateEntry extends React.Component<List, State> {
  destory$ = new Subject();
  state: State = {
    message: ['Not Started']
  };

  componentDidMount(): void {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('promise value');
      }, 1000);
    });

    const observable$ = interval(500).pipe(
      takeWhile(val => val !== 6),
      map(val => `Value ${val}`)
    );

    merge(observable$, promise)
      .pipe(
        catchError(error => of(error)),
        tap(message =>
          this.setState({
            message: [...this.state.message, message]
          })
        ),
        finalize(() =>
          this.setState({
            message: [...this.state.message, 'the end']
          })
        )
      )
      .subscribe();
  }

  componentWillUnmount(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  render() {
    return (
      <div>
        {this.state.message.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
    );
  }
}

export default LH1TemplateEntry;
