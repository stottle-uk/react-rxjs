import React from 'react';
import { BrowserHistory } from './services/BrowserHistory';

export interface RouterOutletContext {
  element: React.ComponentType<any>;
}

const routerOutletContext = React.createContext<RouterOutletContext>({
  element: () => <span />
});

export const RouterOutletProvider = routerOutletContext.Provider;
export const RouterOutletConsumer = routerOutletContext.Consumer;

export interface RouterContext {
  router: BrowserHistory;
}

const routerContext = React.createContext<RouterContext>({
  router: new BrowserHistory()
});

export const RouterProvider = routerContext.Provider;
export const RouterConsumer = routerContext.Consumer;
