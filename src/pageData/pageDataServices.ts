import { createContext } from 'react';
import { Observable } from 'rxjs';
import { browserHistory } from '../router/RouterContext';
import { PageTemplateData, Paging } from './models/pageEntry';
import { ConfigService } from './services/ConfigService';
import { HttpService } from './services/HttpService';
import { ListsService } from './services/ListsService';
import { PageDataService } from './services/PageDataService';
import { PagesService } from './services/PagesService';

const httpService = new HttpService();
const pagesService = new PagesService(httpService);
const listsService = new ListsService(httpService);
const pagesDataService = new PageDataService(
  browserHistory,
  pagesService,
  listsService
);

export const configService = new ConfigService(httpService);

interface PageDataContext {
  getMore: (page: Paging) => void;
  pageData$: Observable<PageTemplateData>;
}

export const PageDataContext = createContext<PageDataContext>({
  getMore: listsService.getMore.bind(listsService),
  pageData$: pagesDataService.pageData$
});
