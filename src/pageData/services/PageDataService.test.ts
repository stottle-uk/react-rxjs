import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Entry, Item, List, PageEntry, Paging } from '../models/pageEntry';
import { HttpService } from './HttpService';
import { ListsService } from './ListsService';
import { PageDataService } from './PageDataService';
import { PagesService } from './PagesService';

const item: Item = {
  path: 'path'
};

const list1: List = {
  id: '1234',
  tagline: 'string',
  path: 'string',
  items: [],
  paging: {} as Paging
};

const list2: List = {
  id: '12345',
  tagline: 'string',
  path: 'string',
  items: [],
  paging: {} as Paging
};

const entry: Entry = {
  type: 'string',
  id: 'string',
  template: 'string',
  title: 'string',
  list: list1
};

const entry2: Entry = {
  type: 'string',
  id: 'string',
  template: 'string',
  title: 'string',
  list: list2
};

const pageData: PageEntry = {
  id: 'string',
  isStatic: false,
  isSystemPage: false,
  metadata: {},
  key: 'string',
  path: '/',
  template: 'string',
  title: 'string',
  entries: [entry]
};

const pageDataOther: PageEntry = {
  id: 'string',
  isStatic: false,
  isSystemPage: false,
  metadata: {},
  key: 'string',
  path: '/other',
  template: 'string',
  title: 'string',
  entries: [entry]
};

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
    jest.clearAllMocks();
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
    const queueListIdSpy = jest.spyOn(listsService, 'queueListId');

    dataService.currentPage$.pipe(tap(() => done())).subscribe();

    dataService.getHomePageData('/');
    expect(queueListIdSpy).toHaveBeenCalledTimes(1);
  });
});
