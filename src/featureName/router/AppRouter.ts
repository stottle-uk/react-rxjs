import { Observable, ReplaySubject } from 'rxjs';

export interface RouterConfig<T> {
  defaultRoute: string;
  routes: RouterConfigRoute<T>[];
}

export interface RouterConfigRoute<T> {
  name: string;
  path: string;
  data: (path: string) => Observable<T>;
  template: React.ComponentType<T>;
}

export class AppRouter<T> {
  private innerActivedRoute$ = new ReplaySubject<RouterConfigRoute<T>>();

  get activedRoute$(): Observable<RouterConfigRoute<T>> {
    return this.innerActivedRoute$.asObservable();
  }

  constructor(private routerConfig: RouterConfig<T>) {
    window.onpopstate = () => this.nextRoute(this.getLocationPath());

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
    const route = this.routerConfig.routes.find(r =>
      this.findRoute(location, r)
    );

    if (route) {
      if (location.startsWith('/filme/') || location.startsWith('/playlist/')) {
        this.innerActivedRoute$.next({
          ...route,
          path: location
        });
      } else {
        this.innerActivedRoute$.next(route);
      }
    }

    // TODO capture not found
    this.innerActivedRoute$.next(route);
  }

  private getLocationPath(): string {
    return window.location.pathname + window.location.search;
  }

  private findRoute(location: string, route: RouterConfigRoute<T>): boolean {
    if (location.startsWith('/filme/') && route.path.startsWith('/filme/')) {
      return true;
    }

    if (
      location.startsWith('/playlist/') &&
      route.path.startsWith('/playlist/')
    ) {
      return true;
    }

    return route.path === decodeURIComponent(location);
  }
}
