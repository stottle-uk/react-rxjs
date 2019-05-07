import { RouterConfigRoute } from '../types/router';

export class RouteMatcher<T> {
  matchRoute(
    path: string,
    routes: RouterConfigRoute<T>[],
    deafultRoute: RouterConfigRoute<T>
  ): RouterConfigRoute<T> {
    const route = routes.find(r => this.findRoute(path, r)) || deafultRoute;

    if (path.startsWith('/filme/') || path.startsWith('/playlist/')) {
      return {
        ...route,
        path: path
      };
    }
    return route;
  }

  private findRoute(path: string, route: RouterConfigRoute<T>): boolean {
    if (path.startsWith('/filme/') && route.path.startsWith('/filme/')) {
      return true;
    }

    if (path.startsWith('/playlist/') && route.path.startsWith('/playlist/')) {
      return true;
    }

    return route.path === decodeURIComponent(path);
  }
}
