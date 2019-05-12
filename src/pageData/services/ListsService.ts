import {
  BehaviorSubject,
  from,
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
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { Dictionary, Item, List, Paging } from '../models/pageEntry';
import { HttpService } from './HttpService';

export class ListsService {
  private innerCurrentList$ = new Subject<List>();
  private innerListQueue$ = new Subject<List>();
  private innerPaging$ = new Subject<Paging>();
  private innerCache$ = new BehaviorSubject<Dictionary<List>>({});

  private get listNotInCache$(): Observable<List> {
    return this.innerCurrentList$.asObservable().pipe(
      withLatestFrom(this.innerCache$),
      filter(([list, cache]) => !cache[list.id]),
      map(([list]) => list),
      tap(list => this.innerListQueue$.next(list))
    );
  }

  private get listQueue$(): Observable<List> {
    return this.innerListQueue$
      .asObservable()
      .pipe(filter(list => !list.items.length));
  }

  private get httpLists$(): Observable<List> {
    return this.listQueue$.pipe(
      bufferTime(200, null, 5),
      filter(lists => !!lists.length),
      map(lists => this.buildListUri(lists.map(l => l.id))),
      mergeMap(uri =>
        this.httpService.get<List[]>(uri).pipe(switchMap(lists => from(lists)))
      )
    );
  }

  private get moreLists$(): Observable<List> {
    return this.innerPaging$.pipe(
      map(paging => paging.next),
      filter(next => !!next),
      distinctUntilChanged(),
      map(paging => `${paging}`),
      switchMap(nextUrl => this.httpService.get<List>(nextUrl))
    );
  }

  get lists$(): Observable<Dictionary<List>> {
    return merge(this.listNotInCache$, this.httpLists$, this.moreLists$).pipe(
      this.appendListFromCache(),
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
      tap(cache => this.innerCache$.next(cache)),
      startWith({})
    );
  }

  constructor(private httpService: HttpService) {}

  queueList(list: List): void {
    this.innerCurrentList$.next(list);
  }

  getMore(paging: Paging): void {
    this.innerPaging$.next(paging);
  }

  private appendListFromCache(): OperatorFunction<List, List> {
    return source =>
      source.pipe(
        withLatestFrom(this.innerCache$),
        map(([list, cache]) =>
          cache[list.id]
            ? {
                ...cache[list.id],
                ...list,
                items: this.concatAndRemoveDuplicates(cache, list)
              }
            : list
        )
      );
  }

  private concatAndRemoveDuplicates(
    cache: Dictionary<List>,
    list: List
  ): Item[] {
    return [...cache[list.id].items, ...list.items].filter(
      (item, i, arr) => arr.findIndex(a => item.id === a.id) === i
    );
  }

  private buildListUri(listIds: string[]): string {
    const encodedListIds = encodeURIComponent(
      listIds.map(listId => `${listId}|page_size=24`).join(',')
    );
    return `/lists?device=web_browser&ff=idp,ldp&ids=${encodedListIds}&segments=globo,trial&sub=Subscriber`;
  }
}
