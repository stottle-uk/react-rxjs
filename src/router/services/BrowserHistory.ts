import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export class BrowserHistory {
  private innerPushedPath$ = new Subject<string>();

  private get onPushState$(): Observable<string> {
    return this.innerPushedPath$.asObservable();
  }

  private get onPopState$(): Observable<string> {
    return fromEvent(window, 'popstate').pipe(
      map(() => this.getLocationPath())
    );
  }

  get activedPath$(): Observable<string> {
    return merge(this.onPopState$, this.onPushState$).pipe(
      startWith(this.getLocationPath())
    );
  }

  go(location: string, replace = false): void {
    if (replace) {
      history.replaceState({}, window.document.title, location);
    } else {
      history.pushState({}, window.document.title, location);
    }
    this.innerPushedPath$.next(location);
  }

  forward(): void {
    history.forward();
  }

  back(): void {
    history.back();
  }

  private getLocationPath(): string {
    return window.location.pathname + window.location.search;
  }
}
