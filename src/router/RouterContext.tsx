import React from 'react';
import { BrowserHistory } from './services/BrowserHistory';

export interface RouterOutletContext {
  element: React.ComponentType<any>;
}

export const routerOutletContext = React.createContext<
  React.ComponentType<any>
>(() => <span />);

export const RouterOutletProvider = routerOutletContext.Provider;
export const RouterOutletConsumer = routerOutletContext.Consumer;

export interface HistoryContext {
  history: BrowserHistory;
}

export const browserHistory = new BrowserHistory();

export const historyContext = React.createContext<HistoryContext>({
  history: browserHistory
});

export const HistoryProvider = historyContext.Provider;
export const HistoryConsumer = historyContext.Consumer;
