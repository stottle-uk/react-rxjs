import React from 'react';

export interface RouterContext {
  go: (path: string) => void;
  element: React.ComponentType<any>;
  data: any;
}

const context = React.createContext<RouterContext>({
  go: (path: string) => {},
  element: () => <span />,
  data: null
});

export const RouterProvider = context.Provider;
export const RouterConsumer = context.Consumer;
