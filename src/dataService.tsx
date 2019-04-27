import { PageEntry } from './featureName/models/pageEntry';
import { BrowserRouter } from './featureName/router/services/BrowserRouter';
import { ConfigService } from './featureName/services/ConfigService';
import { HttpService } from './featureName/services/HttpService';
import { ListsService } from './featureName/services/ListsService';
import { PageDataService } from './featureName/services/PageDataService';
import { PagesService } from './featureName/services/PagesService';

export const httpService = new HttpService();
export const configService = new ConfigService(httpService);
export const pagesService = new PagesService(httpService);
export const listsService = new ListsService(httpService);
export const dataService = new PageDataService(pagesService, listsService);
export const router = new BrowserRouter<PageEntry>({
  routes: []
});
