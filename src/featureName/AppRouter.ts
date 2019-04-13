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
    window.onpopstate = () => this.nextRoute(this.getWithowPath());

    this.nextRoute(this.getWithowPath());
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
    const route = this.routerConfig.routes.find(r => r.path === location);
    this.innerActivedRoute$.next(route);
  }

  private getWithowPath(): string {
    return window.location.pathname + window.location.search;
  }
}
