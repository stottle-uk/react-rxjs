import {
  empty,
  from,
  iif,
  merge,
  Observable,
  ReplaySubject,
  Subject
} from 'rxjs';
import {
  bufferTime,
  defaultIfEmpty,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  scan,
  startWith,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { List, Paging } from '../models/pageEntry';
import { HttpService } from './HttpService';

export interface Dictionary<T> {
  [key: string]: { [key: number]: T };
}

export class ListsService {
  private innerListCache$ = new ReplaySubject<List>();
  private innerPaging$ = new Subject<Paging>();

  get listsCache$(): Observable<Dictionary<List>> {
    return this.innerListCache$.pipe(
      map(list => ({
        [list.id]: { [list.paging.page]: { ...list } }
      })),
      scan(
        (acc, curr) => ({
          ...acc,
          ...curr
        }),
        {} as Dictionary<List>
      ),
      startWith({})
    );
  }

  constructor(private httpService: HttpService) {}

  getLists(listIds: string[]): Observable<List> {
    return merge(
      this.getHttpLists(listIds),
      // this.getCachedLists(listIds),
      this.getMoreLists()
    ).pipe(defaultIfEmpty({} as List));
  }

  getMore(paging: Paging): void {
    this.innerPaging$.next(paging);
  }

  private getCachedLists(listIds: string[]): Observable<List> {
    return from(listIds).pipe(
      withLatestFrom(this.listsCache$),
      filter(
        ([listId, listCache]) => !!listCache[listId] && !!listCache[listId][0]
      ),
      map(([listId, listCache]) => listCache[listId][0])
    );
  }

  private getHttpLists(listIds: string[]): Observable<List> {
    return from(listIds).pipe(
      // withLatestFrom(this.listsCache$),
      // filter(([listId, listCache]) => !listCache[listId]),
      // map(([listId, _]) => listId),
      bufferTime(50, null, 5),
      mergeMap(ids =>
        iif(
          () => !!ids.length,
          this.httpService
            .get<List[]>(this.buildListUri(ids))
            .pipe(
              switchMap(lists =>
                from(lists).pipe(tap(list => this.innerListCache$.next(list)))
              )
            ),
          empty()
        )
      )
    );
  }

  private getMoreLists(): Observable<List> {
    return this.innerPaging$.pipe(
      distinctUntilChanged(),
      map(paging => `${paging.next}`),
      switchMap(nextUrl =>
        this.httpService
          .get<List>(nextUrl)
          .pipe(tap(list => this.innerListCache$.next(list)))
      ),
      startWith({} as List)
    );
  }

  private buildListUri(listIds: string[]): string {
    // return listsUrls[0];
    const yt = encodeURIComponent(
      listIds.map(listId => `${listId}|page_size=24`).join(',')
    );
    return `/lists?device=web_browser&ff=idp,ldp&ids=${yt}&segments=globo,trial&sub=Subscriber`;
  }
}
