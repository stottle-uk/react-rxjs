import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterConfig, RouterConfigRoute } from '../types/router';
import { RouteMatcher } from './RouteMatcher';

export class BrowserRouter<T> {
  private innerPath$ = new ReplaySubject<string>(1);

  get activedRoute$(): Observable<RouterConfigRoute<T>> {
    return this.innerPath$
      .asObservable()
      .pipe(map(route => this.routerMatcher.matchRoute(this.routes, route)));
  }

  get routes(): RouterConfigRoute<T>[] {
    return this.routerConfig.routes;
  }

  constructor(
    private routerConfig: RouterConfig<T>,
    private routerMatcher: RouteMatcher<T>
  ) {
    window.onpopstate = () => this.nextRoute(this.getLocationPath());

    this.nextRoute(this.getLocationPath());
  }

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
