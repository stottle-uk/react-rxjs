import { of } from 'rxjs';
import { skip, tap } from 'rxjs/operators';
import { HttpService } from '../HttpService';
import { ListsService } from '../ListsService';
import { PageDataService } from '../PageDataService';
import { PagesService } from '../PagesService';
import * as testData from './testData';

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
    httpSpy = jest.spyOn(httpService, 'get').mockImplementation(path => {
      if (path.startsWith('/lists')) {
        return of([testData.list1WithItems]);
      }

      return of(testData.pageData);
    });
  });

  it('should return page data from http', done => {
    dataService.currentPage$.subscribe(val => {
      expect(val).toEqual(testData.pageData);
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
    expect(queueListIdSpy).toHaveBeenCalledTimes(
      testData.pageData.entries.length
    );
  });

  describe('lists', () => {
    it('should get not get a list with items from http', done => {
      dataService.currentPage$.subscribe();

      dataService.lists$.pipe(skip(2)).subscribe(val => {
        expect(val).toEqual({
          [testData.list1.id]: testData.list1WithItems,
          [testData.list2.id]: testData.list2WithItems
        });
        expect(httpSpy).toHaveBeenCalledTimes(2);
        done();
      });

      dataService.getHomePageData('/');
    });

    it('should get lists from http', done => {
      dataService.currentPage$.subscribe();

      dataService.lists$.pipe(skip(1)).subscribe(val => {
        expect(val).toEqual({ [testData.list1.id]: testData.list1WithItems });
        done();
      });

      dataService.getHomePageData('/');
    });
  });
});
