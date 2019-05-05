import { from, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { List, PageEntry } from '../models/pageEntry';
import { ListsService } from './ListsService';
import { PagesService } from './PagesService';

export class PageDataService {
  private innerPage$ = new ReplaySubject<PageEntry>(1);
  private innerPath$ = new Subject<string>();

  get path$(): Observable<string> {
    return this.innerPath$.asObservable();
  }

  get currentPage$(): Observable<PageEntry> {
    return this.path$.pipe(
      switchMap(path => this.pages.getPageEntry(path)),
      switchMap(page =>
        from(this.getLists(page)).pipe(
          tap(list => this.lists.queueListId(list)),
          map(() => page)
        )
      )
    );
  }

  constructor(private pages: PagesService, private lists: ListsService) {}

  getHomePageData(path: string): void {
    this.innerPath$.next(path);
  }

  private getLists(pageEntry: PageEntry): List[] {
    const entryLists = pageEntry.entries
      ? pageEntry.entries
          .filter(e => e.list)
          .filter(e => +e.list.id > 0)
          .map(e => e.list)
      : [];

    return !!pageEntry.list && +pageEntry.list.id > 0
      ? [pageEntry.list, ...entryLists]
      : entryLists;
  }

  // private mapEntries(pageEntry: PageEntry, list: List): Entry[] {
  //   return !!list && pageEntry.entries
  //     ? pageEntry.entries.map(entry => {
  //         if (entry && entry.list && entry.list.id === list.id) {
  //           entry.list = {
  //             ...entry.list,
  //             ...list,
  //             items: this.concatAndDedupListItems(entry.list.items, list.items),
  //             paging: list.paging
  //           };
  //         }
  //         return entry;
  //       })
  //     : pageEntry.entries;
  // }

  // private concatAndDedupListItems(
  //   originalLists: Item[],
  //   newLists: Item[]
  // ): Item[] {
  //   return [...originalLists, ...newLists].filter(
  //     (list, index, self) => self.findIndex(t => t.id === list.id) === index
  //   );
  // }
}
