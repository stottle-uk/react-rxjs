import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Entry, List, PageEntry } from '../models/pageEntry';
import { ListsService } from './ListsService';
import { PagesService } from './PagesService';

export class PageDataService {
  private innerPage$ = new ReplaySubject<PageEntry>(1);

  get lists$(): Observable<List> {
    return this.innerPage$.pipe(
      map(page => this.getEmptyLists(page)),
      switchMap(listIds => this.lists.getLists(listIds))
    );
  }

  constructor(private pages: PagesService, private lists: ListsService) {}

  getHomePageData(path: string): Observable<PageEntry> {
    const page$ = this.pages
      .getPageEntry(path)
      .pipe(tap(page => this.innerPage$.next(page)));

    return combineLatest(page$, this.lists$).pipe(
      map(([page, lists]) => ({
        ...page,
        entries: this.mapEntries(page, lists)
      }))
    );
  }

  private getEmptyLists(pageEntry: PageEntry): string[] {
    return !!pageEntry.entries
      ? pageEntry.entries
          .filter(e => e.list)
          .filter(e => !e.list.items.length)
          .filter(e => +e.list.id > 0)
          .map(e => e.list.id)
      : [];
  }

  private mapEntries(pageEntry: PageEntry, list: List): Entry[] {
    return !!list && pageEntry.entries
      ? pageEntry.entries.map(entry => {
          if (entry && entry.list && entry.list.id === list.id) {
            entry.list = {
              ...entry.list,
              ...list,
              items: [...entry.list.items, ...list.items],
              paging: list.paging
            };
          }

          return entry;
        })
      : pageEntry.entries;
  }
}
