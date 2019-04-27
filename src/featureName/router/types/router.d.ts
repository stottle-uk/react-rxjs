import React from 'react';

export interface RouterConfig<T> {
  defaultRoute: RouterConfigRoute<T>;
  routes: RouterConfigRoute<T>[];
}

export interface RouterConfigRoute<T> {
  name: string;
  path: string;
  template: React.ComponentType<T>;
}
