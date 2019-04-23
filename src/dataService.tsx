import { AppRouter } from './featureName/AppRouter';
import HomePage from './featureName/HomePage';
import OtherPage from './featureName/OtherPage';
import { ListsService } from './featureName/pageData/ListsService';
import { PageDataService } from './featureName/pageData/PageDataService';
import { PagesService } from './featureName/pageData/PagesService';
import { PageEntry } from './featureName/Testdata';

const pagesService = new PagesService();
const listsService = new ListsService();
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
