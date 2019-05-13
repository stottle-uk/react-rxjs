import React from 'react';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
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
    new Observable<string>(observer => {
      let count = 0;
      setInterval(() => {
        observer.next(`Value ${count}`);

        if (count === 3) {
          // observer.error('error');
        }

        if (count === 4) {
          observer.complete();
        }
        count++;
      }, 500);
    })
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
