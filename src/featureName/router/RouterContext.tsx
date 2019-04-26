import React from 'react';

export interface RouterContextI {
  go: (path: string) => void;
  element: React.ComponentType<any>;
  data: any;
}

export const RouterContext = React.createContext<RouterContextI>({
  go: (path: string) => {},
  element: () => <span />,
  data: null
});

export const RouterProvider = RouterContext.Provider;
export const RouterConsumer = RouterContext.Consumer;
