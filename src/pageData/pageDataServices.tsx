import { createContext } from 'react';
import { BrowserRouter } from '../router/services/BrowserRouter';
import { RouteMatcher } from '../router/services/RouteMatcher';
import { PageEntry, Paging } from './models/pageEntry';
import { ConfigService } from './services/ConfigService';
import { HttpService } from './services/HttpService';
import { ListsService } from './services/ListsService';
import { PageDataService } from './services/PageDataService';
import { PagesService } from './services/PagesService';
import NotFound from './templates/NotFound';

export const httpService = new HttpService();
export const configService = new ConfigService(httpService);
export const pagesService = new PagesService(httpService);
export const listsService = new ListsService(httpService);
export const dataService = new PageDataService(pagesService, listsService);
export const routeMatcher = new RouteMatcher<PageEntry>();
export const router = new BrowserRouter<PageEntry>(
  {
    defaultRoute: {
      name: 'default',
      path: '/',
      template: NotFound
    },
    routes: []
  },
  routeMatcher
);

interface GetMoreContext {
  getMore: (page: Paging) => void;
}

const context = createContext<GetMoreContext>({
  getMore: listsService.getMore.bind(listsService)
});

export const GetMoreProvider = context.Provider;
export const GetMoreConsumer = context.Consumer;
