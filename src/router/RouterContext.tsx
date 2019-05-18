import React from 'react';
import { BrowserHistory } from './services/BrowserHistory';
import { BrowserRouter } from './services/BrowserRouter';
import { RouteMatcher } from './services/RouteMatcher';

export const browserHistory = new BrowserHistory();
export const routeMatcher = new RouteMatcher<any>();
export const router = new BrowserRouter<any>(routeMatcher);

// History
export const HistoryContext = React.createContext<BrowserHistory>(
  browserHistory
);

// Router
export const RouterContext = React.createContext<BrowserRouter<any>>(router);
