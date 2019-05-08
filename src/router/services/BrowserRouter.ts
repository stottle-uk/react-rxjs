import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RouterConfig, RouterConfigRoute } from '../types/router';
import { RouteMatcher } from './RouteMatcher';

export class BrowserRouter<T> {
  private pushedPath$ = new Subject<string>();

  private get onPushState$(): Observable<string> {
    return this.pushedPath$
      .asObservable()
      .pipe(startWith(this.getLocationPath()));
  }

  private get onPopState$(): Observable<string> {
    return fromEvent(window, 'popstate').pipe(
      map(() => this.getLocationPath())
    );
  }

  get activedRoute$(): Observable<RouterConfigRoute<T>> {
    return merge(this.onPopState$, this.onPushState$).pipe(
      map(path =>
        this.routerMatcher.matchRoute(
          path,
          this.routerConfig.routes,
          this.routerConfig.defaultRoute
        )
      )
    );
  }

  constructor(
    private routerConfig: RouterConfig<T>,
    private routerMatcher: RouteMatcher<T>
  ) {}

  addRoutes(routes: RouterConfigRoute<T>[]): void {
    this.routerConfig.routes = [...this.routerConfig.routes, ...routes];
    this.nextRoute(this.getLocationPath());
  }

  go(location: string): void {
    history.pushState({}, window.document.title, location);
    this.nextRoute(location);
  }

  forward(): void {
    history.forward();
  }

  back(): void {
    history.back();
  }

  private nextRoute(location: string): void {
    this.pushedPath$.next(location);
  }

  private getLocationPath(): string {
    return window.location.pathname + window.location.search;
  }
}
