import { empty, from, iif, merge, Observable, Subject } from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  scan,
  switchMap
} from 'rxjs/operators';
import { Dictionary, List, Paging } from '../models/pageEntry';
import { HttpService } from './HttpService';

export class ListsService {
  private innerList$ = new Subject<List>();
  private innerPaging$ = new Subject<Paging>();

  get getMoreLists2(): Observable<List> {
    return this.innerPaging$.pipe(
      map(paging => paging.next),
      filter(next => !!next),
      distinctUntilChanged(),
      map(paging => `${paging}`),
      switchMap(nextUrl => this.httpService.get<List>(nextUrl))
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

  get lists$(): Observable<Dictionary<List>> {
    return merge(this.innerList$, this.httpLists, this.getMoreLists2).pipe(
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
      // tap(d => console.log(d))
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

  private buildListUri(listIds: string[]): string {
    const encodedListIds = encodeURIComponent(
      listIds.map(listId => `${listId}|page_size=24`).join(',')
    );
    return `/lists?device=web_browser&ff=idp,ldp&ids=${encodedListIds}&segments=globo,trial&sub=Subscriber`;
  }
}
