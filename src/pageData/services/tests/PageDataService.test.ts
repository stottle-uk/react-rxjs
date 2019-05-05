import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from '../HttpService';
import { ListsService } from '../ListsService';
import { PageDataService } from '../PageDataService';
import { PagesService } from '../PagesService';
import { pageData } from './testData';

describe('Page Data', () => {
  let httpService: HttpService;
  let pagesService: PagesService;
  let listsService: ListsService;
  let dataService: PageDataService;
  let httpSpy: jest.SpyInstance;

  beforeEach(() => {
    httpService = new HttpService();
    pagesService = new PagesService(httpService);
    listsService = new ListsService(httpService);
    dataService = new PageDataService(pagesService, listsService);
    httpSpy = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => of(pageData));
  });

  it('should return page data from http', done => {
    dataService.currentPage$.subscribe(val => {
      expect(val).toEqual(pageData);
      done();
    });

    dataService.getHomePageData('/');
  });

  it('should return page data from cache', done => {
    dataService.currentPage$.pipe(tap(() => done())).subscribe();

    dataService.getHomePageData('/');
    dataService.getHomePageData('/');
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });

  it('should queue lists', done => {
    const queueListIdSpy = jest.spyOn(listsService, 'queueList');

    dataService.currentPage$.pipe(tap(() => done())).subscribe();

    dataService.getHomePageData('/');
    expect(queueListIdSpy).toHaveBeenCalledTimes(1);
  });
});
