import { combineLatest, from, iif, Observable, of, ReplaySubject } from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  scan,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { Entry, List, PageEntry } from '../Testdata';
import { RocketService } from './RocketService';

export interface Dictionary<T> {
  [key: string]: T;
}

export class PageDataService {
  private innerPage$ = new ReplaySubject<PageEntry>();

  constructor(private rocket: RocketService) {}

  get lists$(): Observable<Dictionary<List>> {
    return this.innerPage$.pipe(
      switchMap(page =>
        this.queueGetList(page).pipe(
          mergeMap(listIds =>
            iif(() => !!listIds.length, this.rocket.getLists(listIds), of([]))
          ),
          mergeMap(lists => from(lists)),
          map(list => ({
            [list.id]: list
          })),
          scan(
            (acc, curr) => ({
              ...acc,
              ...curr
            }),
            {} as Dictionary<List>
          )
        )
      )
    );
  }

  getHomePageData(path: string): Observable<PageEntry> {
    const pageEntry$ = this.rocket
      .getPageEntry(path)
      .pipe(tap(page => this.innerPage$.next(page)));
    const lists$ = this.lists$.pipe(startWith({}));

    return combineLatest(pageEntry$, lists$).pipe(
      map(([page, lists]) => ({
        ...page,
        entries: this.mapEntries(page, lists)
      })),
      distinctUntilChanged()
    );
  }

  private queueGetList(pageEntry: PageEntry): Observable<string[]> {
    return from(this.getEmptyLists(pageEntry)).pipe(
      filter(id => +id > 0),
      bufferTime(100, null, 5)
    );
  }

  private getEmptyLists(pageEntry: PageEntry): string[] {
    return pageEntry.entries
      .filter(e => e.list && !e.list.items.length)
      .map(e => e.list.id);
  }

  private mapEntries(pageEntry: PageEntry, lists: Dictionary<List>): Entry[] {
    return pageEntry.entries.map(e => {
      if (e.list) {
        const list = lists[e.list.id];
        if (list) {
          e.list = { ...e.list, ...lists[e.list.id] };
        }
      }
      return e;
    });
  }
}
