import { PageEntry } from './featureName/models/pageEntry';
import { AppRouter } from './featureName/router/AppRouter';
import { HttpService } from './featureName/services/HttpService';
import { ListsService } from './featureName/services/ListsService';
import { PageDataService } from './featureName/services/PageDataService';
import { PagesService } from './featureName/services/PagesService';
import HomePage from './featureName/templates/HomePage';
import OtherPage from './featureName/templates/OtherPage';

const httpService = new HttpService();
const pagesService = new PagesService(httpService);
const listsService = new ListsService(httpService);
const dataService = new PageDataService(pagesService, listsService);
export const router = new AppRouter<PageEntry>({
  defaultRoute: '',
  routes: [
    {
      name: 'Home',
      path: '/',
      template: HomePage,
      data: path => dataService.getHomePageData(path)
    },
    {
      name: '/filmes-comedia/g',
      path: '/filmes-comedia/g',
      template: HomePage,
      data: path => dataService.getHomePageData(path)
    },
    {
      name: 'Film Detail',
      path: '/filme/:filmId',
      template: OtherPage,
      data: path => dataService.getHomePageData(path)
    },
    {
      name: 'Film Detail',
      path: '/playlist/:playlist',
      template: OtherPage,
      data: path => dataService.getHomePageData(path)
    }
  ]
});
