import {
  empty,
  from,
  iif,
  merge,
  Observable,
  of,
  OperatorFunction,
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
import { Dictionary, List, Paging } from '../models/pageEntry';
import { HttpService } from './HttpService';

export class ListsService {
  private innerList$ = new Subject<List>();
  private innerListCache$ = new ReplaySubject<List>();
  private innerPaging$ = new Subject<Paging>();

  get listsCache$(): Observable<Dictionary<List>> {
    return this.innerListCache$.pipe(
      map(list => ({
        [list.id]: list
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

  get getMoreLists2(): Observable<List> {
    return this.innerPaging$.pipe(
      map(paging => paging.next),
      filter(next => !!next),
      distinctUntilChanged(),
      map(paging => `${paging}`),
      switchMap(nextUrl =>
        this.httpService.get<List>(nextUrl).pipe(this.addToCache())
      ),
      startWith({} as List)
    );
  }

  get httpLists(): Observable<List> {
    return this.innerList$.pipe(
      filter(list => !list.items.length),
      bufferTime(500, null, 5),
      mergeMap(lists =>
        iif(
          () => !!lists.length,
          this.httpService
            .get<List[]>(this.buildListUri(lists))
            .pipe(switchMap(lists => from(lists).pipe(this.addToCache()))),
          empty()
        )
      )
    );
  }

  get cachedLists(): Observable<List> {
    return this.innerList$.pipe(
      withLatestFrom(this.listsCache$),
      mergeMap(([list, listCache]) =>
        iif(
          () => !!listCache[list.id],
          of(listCache[list.id]),
          of(list).pipe(tap(list => this.innerListCache$.next(list)))
        )
      )
    );
  }

  get lists$(): Observable<List> {
    return merge(this.httpLists, this.cachedLists, this.getMoreLists2).pipe(
      defaultIfEmpty({} as List),
      tap(d => console.log(d))
    );
  }

  constructor(private httpService: HttpService) {}

  queueListId(list: List): void {
    this.innerList$.next(list);
  }

  getMore(paging: Paging): void {
    this.innerPaging$.next(paging);
  }

  private addToCache(): OperatorFunction<List, List> {
    return source =>
      source.pipe(
        withLatestFrom(this.listsCache$),
        map(([list, cache]) => ({
          ...cache[list.id],
          ...list,
          items: [...cache[list.id].items, ...list.items]
        })),
        tap(list => this.innerListCache$.next(list))
      );
  }

  private buildListUri(lists: List[]): string {
    // return listsUrls[0];
    const yt = encodeURIComponent(
      lists.map(listId => `${listId.id}|page_size=24`).join(',')
    );
    return `/lists?device=web_browser&ff=idp,ldp&ids=${yt}&segments=globo,trial&sub=Subscriber`;
  }
}
