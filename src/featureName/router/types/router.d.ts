import { Observable } from 'rxjs';

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
