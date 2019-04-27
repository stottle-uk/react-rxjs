import { PageEntry } from './featureName/models/pageEntry';
import { BrowserRouter } from './featureName/router/services/BrowserRouter';
import { RouteMatcher } from './featureName/router/services/RouteMatcher';
import { ConfigService } from './featureName/services/ConfigService';
import { HttpService } from './featureName/services/HttpService';
import { ListsService } from './featureName/services/ListsService';
import { PageDataService } from './featureName/services/PageDataService';
import { PagesService } from './featureName/services/PagesService';
import NotFound from './featureName/templates/NotFound';

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
