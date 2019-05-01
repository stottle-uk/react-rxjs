import { combineLatest, from, merge, Observable, ReplaySubject } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { Entry, Item, List, PageEntry } from '../models/pageEntry';
import { ListsService } from './ListsService';
import { PagesService } from './PagesService';

export class PageDataService {
  private innerPage$ = new ReplaySubject<PageEntry>(1);

  get queuedLists$(): Observable<List> {
    return this.innerPage$.pipe(
      map(page => this.getLists(page)),
      switchMap(lists =>
        from(lists).pipe(tap(list => this.lists.queueListId(list)))
      )
    );
  }

  get lists$(): Observable<List> {
    return merge(this.queuedLists$, this.lists.lists$).pipe(
      startWith({} as List)
    );
  }

  constructor(private pages: PagesService, private lists: ListsService) {}

  getHomePageData(path: string): Observable<PageEntry> {
    const page$ = this.pages
      .getPageEntry(path)
      .pipe(tap(page => this.innerPage$.next(page)));

    return combineLatest(page$, this.lists$).pipe(
      tap(d => console.log(d)),
      map(([page, list]) => ({
        ...page,
        entries: this.mapEntries(page, list)
      }))
    );
  }

  private getLists(pageEntry: PageEntry): List[] {
    const entryLists = !!pageEntry.entries
      ? pageEntry.entries
          .filter(e => e.list)
          .filter(e => +e.list.id > 0)
          .map(e => e.list)
      : [];

    return !!pageEntry.list && +pageEntry.list.id > 0
      ? [pageEntry.list, ...entryLists]
      : entryLists;
  }

  private mapEntries(pageEntry: PageEntry, list: List): Entry[] {
    return !!list && pageEntry.entries
      ? pageEntry.entries.map(entry => {
          if (entry && entry.list && entry.list.id === list.id) {
            entry.list = {
              ...entry.list,
              ...list,
              items: this.concatListItems(entry.list.items, list.items),
              paging: list.paging
            };
          }
          return entry;
        })
      : pageEntry.entries;
  }

  private concatListItems(originalLists: Item[], newLists: Item[]): Item[] {
    return [...originalLists, ...newLists].filter(
      (list, index, self) => self.findIndex(t => t.id === list.id) === index
    );
  }
}
