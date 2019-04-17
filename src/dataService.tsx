import { AppRouter } from './featureName/AppRouter';
import HomePage from './featureName/HomePage';
import OtherPage from './featureName/OtherPage';
import { ListsService } from './featureName/pageData/ListsService';
import { PageDataService } from './featureName/pageData/PageDataService';
import { PagesService } from './featureName/pageData/PagesService';
import { PageEntry } from './featureName/Testdata';

const rocketService = new PagesService();
const listsService = new ListsService();
const dataService = new PageDataService(rocketService, listsService);
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
      name: 'Home',
      path: '/home',
      template: HomePage,
      data: path => dataService.getHomePageData(path)
    },
    {
      name: 'lancamentos-de-filmes',
      path: '/lancamentos-de-filmes',
      template: OtherPage,
      data: path => dataService.getHomePageData(path)
    },
    {
      name: 'Mamma_Mia_Lá_Vamos_Nós_De_Novo_11947',
      path: '/filme/Mamma_Mia_Lá_Vamos_Nós_De_Novo_11947',
      template: OtherPage,
      data: path => dataService.getHomePageData(path)
    }
  ]
});
