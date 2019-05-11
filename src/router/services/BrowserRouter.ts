import { RouterConfig, RouterConfigRoute } from '../types/router';
import { RouteMatcher } from './RouteMatcher';

export class BrowserRouter<T> {
  constructor(
    private routerConfig: RouterConfig<T>,
    private routerMatcher: RouteMatcher<T>
  ) {}

  addRoutes(routes: RouterConfigRoute<T>[]): void {
    this.routerConfig.routes = [...this.routerConfig.routes, ...routes];
  }

  matchRoute(path: string): RouterConfigRoute<T> {
    return this.routerMatcher.matchRoute(
      path,
      this.routerConfig.routes,
      this.routerConfig.defaultRoute
    );
  }
}
