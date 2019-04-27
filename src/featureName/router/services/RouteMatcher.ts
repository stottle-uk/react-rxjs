import { RouterConfigRoute } from '../types/router';

export class RouteMatcher<T> {
  matchRoute(
    routes: RouterConfigRoute<T>[],
    path: string,
    deafultRoute: RouterConfigRoute<T>
  ): RouterConfigRoute<T> {
    const route = routes.find(r => this.findRoute(r, path)) || deafultRoute;

    if (path.startsWith('/filme/') || path.startsWith('/playlist/')) {
      return {
        ...route,
        path: path
      };
    }
    return route;
  }

  private findRoute(route: RouterConfigRoute<T>, path: string): boolean {
    if (path.startsWith('/filme/') && route.path.startsWith('/filme/')) {
      return true;
    }

    if (path.startsWith('/playlist/') && route.path.startsWith('/playlist/')) {
      return true;
    }

    return route.path === decodeURIComponent(path);
  }
}
