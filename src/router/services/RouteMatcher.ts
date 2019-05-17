import { RouterConfigRoute } from '../types/router';

export class RouteMatcher<T> {
  matchRoute(
    path: string,
    routes: RouterConfigRoute<T>[]
  ): RouterConfigRoute<T> {
    const route = routes.filter(r => this.findRoute(path, r))[0];

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
