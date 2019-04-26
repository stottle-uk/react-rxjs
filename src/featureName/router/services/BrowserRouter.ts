import { Observable, ReplaySubject } from 'rxjs';
import { RouterConfig, RouterConfigRoute } from '../types/router';

export class BrowserRouter<T> {
  private innerActivedRoute$ = new ReplaySubject<RouterConfigRoute<T>>(1);

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
    const route = this.findRoute(location);

    if (route) {
      this.setActiveRoute(location, route);
    } else {
      this.innerActivedRoute$.next(route);
    }
  }

  private getLocationPath(): string {
    return window.location.pathname + window.location.search;
  }

  private setActiveRoute(location: string, route: RouterConfigRoute<T>) {
    if (location.startsWith('/filme/') || location.startsWith('/playlist/')) {
      this.innerActivedRoute$.next({
        ...route,
        path: location
      });
    } else {
      this.innerActivedRoute$.next(route);
    }
  }

  private findRoute(location: string) {
    return this.routerConfig.routes.find(r => this.matchRoute(location, r));
  }

  private matchRoute(location: string, route: RouterConfigRoute<T>): boolean {
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
