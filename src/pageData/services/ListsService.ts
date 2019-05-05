import {
  BehaviorSubject,
  empty,
  from,
  iif,
  merge,
  Observable,
  Subject
} from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  scan,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { Dictionary, List, Paging } from '../models/pageEntry';
import { HttpService } from './HttpService';

export class ListsService {
  private innerCurrentList$ = new Subject<List>();
  private innerPaging$ = new Subject<Paging>();
  private innerCache$ = new BehaviorSubject<Dictionary<List>>({});

  get currentList$(): Observable<List> {
    return this.innerCurrentList$.asObservable().pipe(
      withLatestFrom(this.innerCache$),
      filter(([list, cache]) => !cache[list.id]),
      map(([list, cache]) => list)
    );
  }

  get moreLists$(): Observable<List> {
    return this.innerPaging$.pipe(
      map(paging => paging.next),
      filter(next => !!next),
      distinctUntilChanged(),
      map(paging => `${paging}`),
      switchMap(nextUrl =>
        this.httpService.get<List>(nextUrl).pipe(
          withLatestFrom(this.innerCache$),
          // tap(d => console.log(d)),
          map(([list, cache]) => ({
            ...cache[list.id],
            ...list,
            items: [...cache[list.id].items, ...list.items]
          }))
        )
      )
    );
  }

  get httpLists$(): Observable<List> {
    return this.innerCurrentList$.pipe(
      filter(list => !list.items.length),
      withLatestFrom(this.innerCache$),
      filter(([list, cache]) => cache[list.id] && !cache[list.id].items.length),
      map(([list, cache]) => list),
      bufferTime(0, null, 5),
      // tap(d => console.log(d)),
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

  get listsCache$(): Observable<Dictionary<List>> {
    return merge(
      this.innerCurrentList$.pipe(
        withLatestFrom(this.innerCache$),
        // tap(d => console.log(d)),
        filter(([list, cache]) => !cache[list.id]),
        map(([list, cache]) => list)
      ),
      this.httpLists$,
      this.moreLists$
    ).pipe(
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
    return this.listsCache$.pipe(tap(cache => this.innerCache$.next(cache)));
  }

  constructor(private httpService: HttpService) {}

  queueList(list: List): void {
    this.innerCurrentList$.next(list);
  }

  getMore(paging: Paging): void {
    this.innerPaging$.next(paging);
  }

  private buildListUri(listIds: string[]): string {
    const encodedListIds = encodeURIComponent(
      listIds.map(listId => `${listId}|page_size=24`).join(',')
    );
    return `/lists?device=web_browser&ff=idp,ldp&ids=${encodedListIds}&segments=globo,trial&sub=Subscriber`;
  }
}
