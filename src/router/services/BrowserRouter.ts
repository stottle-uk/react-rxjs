import { RouterConfigRoute } from '../types/router';
import { RouteMatcher } from './RouteMatcher';

export class BrowserRouter<T> {
  private routerConfig: RouterConfigRoute<T>[] = [];

  constructor(private routerMatcher: RouteMatcher<T>) {}

  addRoutes(routes: RouterConfigRoute<T>[]): void {
    this.routerConfig = [...this.routerConfig, ...routes];
  }

  matchRoute(path: string): RouterConfigRoute<T> {
    return this.routerMatcher.matchRoute(path, this.routerConfig);
  }
}
