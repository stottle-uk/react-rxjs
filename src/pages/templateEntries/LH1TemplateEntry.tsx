import React from 'react';
import { interval, merge, Subject } from 'rxjs';
import { bufferCount, finalize, map, takeWhile, tap } from 'rxjs/operators';
import { List } from '../../pageData/models/pageEntry';
import './P2TemplateEntry.css';

interface State {
  message: string[];
}

class LH1TemplateEntry extends React.Component<List, State> {
  input$ = new Subject<string>();
  destory$ = new Subject();
  state: State = {
    message: ['Not Started']
  };

  componentDidMount(): void {
    const promise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        resolve('promise value');
      }, 1000);
    });

    const observable$ = interval(500).pipe(
      takeWhile(val => val !== 50),
      map(val => `Value ${val}`)
    );

    merge(observable$, promise, this.input$)
      .pipe(
        bufferCount(5),
        // catchError(error => of(error)),
        map(vals => vals.reduce((prev, curr) => `${prev} ${curr}`, '')),
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

  private onInput(e: React.ChangeEvent<HTMLInputElement>) {
    this.input$.next(e.target.value);
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.onInput.bind(this)} />
        {this.state.message.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
    );
  }
}

export default LH1TemplateEntry;
