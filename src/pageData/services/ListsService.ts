import {
  combineLatest,
  empty,
  from,
  iif,
  merge,
  Observable,
  OperatorFunction,
  Subject
} from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  scan,
  startWith,
  switchMap
} from 'rxjs/operators';
import { Dictionary, List, Paging } from '../models/pageEntry';
import { HttpService } from './HttpService';

export class ListsService {
  private innerList$ = new Subject<List>();
  private innerPaging$ = new Subject<Paging>();

  get getMoreLists(): Observable<List> {
    return this.innerPaging$.pipe(
      map(paging => paging.next),
      filter(next => !!next),
      distinctUntilChanged(),
      map(paging => `${paging}`),
      switchMap(nextUrl => this.httpService.get<List>(nextUrl)),
      startWith({} as List)
    );
  }

  get httpLists(): Observable<List> {
    return this.innerList$.pipe(
      filter(list => !list.items.length),
      bufferTime(50, null, 1),
      mergeMap(lists =>
        iif(
          () => !!lists.length,
          this.httpService
            .get<List[]>(this.buildListUri(lists.map(list => list.id)))
            .pipe(switchMap(lists => from(lists))),
          empty()
        )
      )
    );
  }

  get listsCache(): Observable<Dictionary<List>> {
    return merge(this.innerList$, this.httpLists).pipe(
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
    );
  }

  get lists$(): Observable<Dictionary<List>> {
    return combineLatest(this.listsCache, this.getMoreLists).pipe(
      this.concatLists()
    );
  }

  constructor(private httpService: HttpService) {}

  queueList(list: List): void {
    this.innerList$.next(list);
  }

  getMore(paging: Paging): void {
    this.innerPaging$.next(paging);
  }

  getList(listId: string): Observable<List[]> {
    return this.httpService.get<List[]>(this.buildListUri([listId]));
  }

  private concatLists(): OperatorFunction<
    [Dictionary<List>, List],
    Dictionary<List>
  > {
    return source =>
      source.pipe(
        map(([cache, list]) =>
          Object.keys(list).length
            ? {
                ...cache,
                [list.id]: {
                  ...cache[list.id],
                  ...list,
                  items: [...cache[list.id].items, ...list.items]
                }
              }
            : cache
        )
      );
  }

  private buildListUri(listIds: string[]): string {
    const encodedListIds = encodeURIComponent(
      listIds.map(listId => `${listId}|page_size=24`).join(',')
    );
    return `/lists?device=web_browser&ff=idp,ldp&ids=${encodedListIds}&segments=globo,trial&sub=Subscriber`;
  }
}
