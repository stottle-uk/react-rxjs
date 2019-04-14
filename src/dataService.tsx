import { of } from 'rxjs';
import { AppRouter } from './featureName/AppRouter';
import HomePage from './featureName/HomePage';
import * as testData from './featureName/homePageData';
import OtherPage from './featureName/OtherPage';
import { PageDataService } from './featureName/pageData/PageDataService';
import { PageEntry } from './featureName/Testdata';

const dataService = new PageDataService();
export const router = new AppRouter<PageEntry>({
  defaultRoute: '',
  routes: [
    {
      name: 'Home',
      path: '/',
      template: HomePage,
      data: () => dataService.getHomePageData()
    },
    {
      name: 'Home',
      path: '/home',
      template: HomePage,
      data: () => of(testData.homePageData)
    },
    {
      name: 'Other',
      path: '/other',
      template: OtherPage,
      data: () => of(testData.otherPageData)
    }
  ]
});
