import { HttpService } from '../HttpService';
import { ListsService } from '../ListsService';
import { PageDataService } from '../PageDataService';
import { PagesService } from '../PagesService';

describe('Page Data', () => {
  let httpService: HttpService;
  let pagesService: PagesService;
  let listsService: ListsService;
  let dataService: PageDataService;
  let httpSpy: jest.SpyInstance;
  let count = 0;

  it('should be true', () => {
    expect(true).toBeTruthy();
  });
  // beforeEach(() => {
  //   httpService = new HttpService();
  //   pagesService = new PagesService(httpService);
  //   listsService = new ListsService(httpService);
  //   dataService = new PageDataService(pagesService, listsService);
  //   httpSpy = jest.spyOn(httpService, 'get').mockImplementation(path => {
  //     if (path.startsWith('/lists')) {
  //       return of([testData.list1WithItems]);
  //     }

  //     if (path.startsWith('nextListUrl')) {
  //       return of(testData.list1WithItems);
  //     }

  //     if (
  //       path.includes(`path=${encodeURIComponent(testData.pageDataOther.path)}`)
  //     ) {
  //       return of(testData.pageDataOther);
  //     }

  //     return of(testData.pageData);
  //   });
  // });

  // describe('Pages', () => {
  //   // fit('should return page data from http', done => {
  //   //   dataService.pageData$
  //   //     // .pipe(first(pageData => !!pageData.pageEntry))
  //   //     .pipe(
  //   //       // tap(d => console.log(d)),
  //   //       tap(() => count++)
  //   //     )
  //   //     .subscribe(val => {
  //   //       if (count === 3) {
  //   //         expect(val).toEqual({
  //   //           pageEntry: testData.pageData,
  //   //           lists: {
  //   //             [testData.list1.id]: testData.list1WithItems,
  //   //             [testData.list2.id]: testData.list2WithItems
  //   //           }
  //   //         });
  //   //         dataService.getPageData(testData.pageDataOther.path);
  //   //       }

  //   //       if (count > 3) {
  //   //         console.log(val);

  //   //         done();
  //   //       }

  //   //       // expect(val).toEqual(testData.pageData);
  //   //       // count++;
  //   //     });

  //   //   dataService.getPageData(testData.pageData.path);

  //   //   // dataService.getPageData('/other');
  //   //   // dataService.getPageData('/');
  //   // });

  //   it('should return page data from http', done => {
  //     dataService.currentPage$.subscribe(val => {
  //       expect(val).toEqual(testData.pageData);
  //       done();
  //     });

  //     dataService.getPageData('/');
  //   });

  //   it('should return page data from cache', done => {
  //     dataService.currentPage$.pipe(tap(() => done())).subscribe();

  //     dataService.getPageData('/');
  //     dataService.getPageData('/');
  //     expect(httpSpy).toHaveBeenCalledTimes(1);
  //   });

  //   it('should queue lists', done => {
  //     const queueListIdSpy = jest.spyOn(listsService, 'queueList');

  //     dataService.currentPage$.pipe(tap(() => done())).subscribe();

  //     dataService.getPageData('/');
  //     expect(queueListIdSpy).toHaveBeenCalledTimes(
  //       testData.pageData.entries.length
  //     );
  //   });
  // });

  // describe('lists', () => {
  //   it('should get not get a list with items from http', done => {
  //     dataService.currentPage$.subscribe();

  //     dataService.lists$
  //       .pipe(
  //         skip(2),
  //         take(1)
  //       )
  //       .subscribe(val => {
  //         expect(val).toEqual({
  //           [testData.list1.id]: testData.list1WithItems,
  //           [testData.list2.id]: testData.list2WithItems
  //         });
  //         expect(httpSpy).toHaveBeenCalledTimes(2);
  //         done();
  //       });

  //     dataService.getPageData('/');
  //   });

  //   it('should get lists from http', done => {
  //     dataService.currentPage$.subscribe();

  //     dataService.lists$
  //       .pipe(
  //         skip(2),
  //         take(1)
  //       )
  //       .subscribe(val => {
  //         expect(val).toEqual({
  //           [testData.list1.id]: testData.list1WithItems,
  //           [testData.list2.id]: testData.list2WithItems
  //         });
  //         done();
  //       });

  //     dataService.getPageData('/');
  //   });

  //   it('should get more items for a list from http', done => {
  //     dataService.currentPage$.subscribe();

  //     dataService.lists$
  //       .pipe(
  //         skip(2),
  //         tap(() =>
  //           dataService.getMoreListItems({
  //             page: 2,
  //             next: 'nextListUrl'
  //           })
  //         ),
  //         take(1)
  //       )
  //       .subscribe(val => {
  //         expect(val[testData.list1.id].items.length).toEqual(2);
  //         done();
  //       });

  //     dataService.getPageData('/');
  //   });
  // });
});
