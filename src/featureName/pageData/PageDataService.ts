import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Entry, List, PageEntry } from '../Testdata';
import { ListsService } from './ListsService';
import { PagesService } from './PagesService';

export class PageDataService {
  private innerPage$ = new ReplaySubject<PageEntry>();

  constructor(private pages: PagesService, private lists: ListsService) {}

  get lists$(): Observable<List> {
    return this.innerPage$.pipe(
      map(page => this.getEmptyLists(page)),
      switchMap(listIds => this.lists.getLists(listIds))
    );
  }

  getHomePageData(path: string): Observable<PageEntry> {
    const pageEntry$ = this.pages
      .getPageEntry(path)
      .pipe(tap(page => this.innerPage$.next(page)));

    return combineLatest(pageEntry$, this.lists$).pipe(
      map(([page, lists]) => ({
        ...page,
        entries: this.mapEntries(page, lists)
      })),
      distinctUntilChanged()
    );
  }

  private getEmptyLists(pageEntry: PageEntry): string[] {
    return pageEntry.entries
      .filter(e => e.list)
      .filter(e => !e.list.items.length)
      .filter(e => +e.list.id > 0)
      .map(e => e.list.id);
  }

  private mapEntries(pageEntry: PageEntry, list: List): Entry[] {
    return !!list
      ? pageEntry.entries.map(entry => {
          if (entry && entry.list && entry.list.id === list.id) {
            entry.list = { ...entry.list, ...list };
          }
          return entry;
        })
      : pageEntry.entries;
  }
}
