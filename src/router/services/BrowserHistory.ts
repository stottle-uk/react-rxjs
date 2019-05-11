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

  get activatedPath$(): Observable<string> {
    return merge(this.onPopState$, this.onPushState$).pipe(
      startWith(this.getLocationPath())
    );
  }

  go(location: string, replace = false): void {
    if (replace) {
      this.replaceState(location);
    } else {
      this.pushState(location);
    }
    this.innerPushedPath$.next(location);
  }

  refresh(): void {
    this.go(this.getLocationPath(), true);
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

  private replaceState(location: string): void {
    history.replaceState({}, window.document.title, location);
  }

  private pushState(location: string): void {
    history.pushState({}, window.document.title, location);
  }
}
