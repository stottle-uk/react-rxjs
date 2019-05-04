import { of } from 'rxjs';
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
  path: 'string',
  template: 'string',
  title: 'string',
  entries: [entry2, entry, entry2, entry2, entry2, entry2]
};

it('renders without crashing', done => {
  const httpService = new HttpService();
  const pagesService = new PagesService(httpService);
  const listsService = new ListsService(httpService);
  const dataService = new PageDataService(pagesService, listsService);

  jest.spyOn(httpService, 'get').mockImplementation(path => {
    if (
      path ===
      '/page?device=web_browser&ff=idp%2Cldp&list_page_size=24&max_list_prefetch=3&path=%2F&segments=globo%2Ctrial&sub=Subscriber&text_entry_format=html'
    ) {
      return of(pageData);
    }

    console.log(path);
    if (path.startsWith('/lists')) {
      return of(list1);
    }
    return of({});
  });
  let count = 0;

  dataService.getHomePageData('/').subscribe(val => {
    console.log(val);

    if (count === 0) {
      expect(val).toEqual({
        pageEntry: pageData,
        lists: {}
      });
    }

    if ([1, 2, 3, 4, 5, 6].includes(count)) {
      expect(val).toEqual({
        pageEntry: pageData,
        lists: {}
      });
    }

    if (count === 7) {
      expect(val).toEqual({
        pageEntry: pageData,
        lists: { [list2.id]: list2 }
      });
    }

    console.log(count);

    if (count > 8) {
      done();
    }

    count++;
  });
});
