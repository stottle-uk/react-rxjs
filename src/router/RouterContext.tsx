import React from 'react';
import { BrowserHistory } from './services/BrowserHistory';
import { BrowserRouter } from './services/BrowserRouter';
import { RouteMatcher } from './services/RouteMatcher';

// Activated Path
export interface ActivatedPathContext {
  path: string;
}

export const ActivatedPathContext = React.createContext<ActivatedPathContext>({
  path: ''
});

// History
export interface HistoryContext {
  history: BrowserHistory;
}

export const browserHistory = new BrowserHistory();

export const HistoryContext = React.createContext<HistoryContext>({
  history: browserHistory
});

// Router
export const routeMatcher = new RouteMatcher<any>();

export interface RouterContext {
  router: BrowserRouter<any>;
}

export const router = new BrowserRouter<any>(routeMatcher);

export const RouterContext = React.createContext<RouterContext>({
  router
});
