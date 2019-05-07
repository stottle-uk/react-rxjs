import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterConfig, RouterConfigRoute } from '../types/router';
import { RouteMatcher } from './RouteMatcher';

export class BrowserRouter<T> {
  private innerPath$ = new BehaviorSubject<string>(this.getLocationPath());

  private get path$(): Observable<string> {
    return this.innerPath$.asObservable();
  }

  private get onPopState$(): Observable<string> {
    return fromEvent(window, 'popstate').pipe(
      map(() => this.getLocationPath())
    );
  }

  get activedRoute$(): Observable<RouterConfigRoute<T>> {
    return merge(this.onPopState$, this.path$).pipe(
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
    this.innerPath$.next(location);
  }

  private getLocationPath(): string {
    return window.location.pathname + window.location.search;
  }
}
