import { AppRouter } from './featureName/AppRouter';
import HomePage from './featureName/HomePage';
import OtherPage from './featureName/OtherPage';
import { PageDataService } from './featureName/pageData/PageDataService';
import { RocketService } from './featureName/pageData/RocketService';
import { PageEntry } from './featureName/Testdata';

const rocketService = new RocketService();
const dataService = new PageDataService(rocketService);
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
    }
  ]
});
