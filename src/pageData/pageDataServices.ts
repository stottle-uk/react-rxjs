import { browserHistory } from '../router/RouterContext';
import { ConfigService } from './services/ConfigService';
import { HttpService } from './services/HttpService';
import { ListsService } from './services/ListsService';
import { PageDataService } from './services/PageDataService';
import { PagesService } from './services/PagesService';

export const httpService = new HttpService();
export const configService = new ConfigService(httpService);
export const pagesService = new PagesService(httpService);
export const listsService = new ListsService(httpService);
export const pagesDataService = new PageDataService(
  browserHistory,
  pagesService,
  listsService
);
