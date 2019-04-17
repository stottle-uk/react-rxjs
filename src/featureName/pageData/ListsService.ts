import { empty, from, iif, merge, Observable, ReplaySubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  bufferTime,
  defaultIfEmpty,
  filter,
  map,
  mergeMap,
  scan,
  startWith,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { List } from '../Testdata';

export interface Dictionary<T> {
  [key: string]: T;
}

export class ListsService {
  private innerListCache$ = new ReplaySubject<List>();

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

  getLists(listIds: string[]): Observable<List> {
    // // const source = from([1, 2, 3, 4, 5, 6]);
    // console.log(listIds);

    // const source = from(listIds).pipe(withLatestFrom(this.listsCache$));
    // //first value is true, second false
    // const [evens, odds] = partition(
    //   ([listId, listsCache]: [string, Dictionary<List>]) => !!listsCache[listId]
    // )(source);

    // evens.subscribe(console.log);
    // odds.subscribe(console.log);

    return merge(this.getHttpLists(listIds), this.getCachedLists(listIds)).pipe(
      defaultIfEmpty({} as List)
    );
  }

  private getCachedLists(listIds: string[]) {
    return from(listIds).pipe(
      withLatestFrom(this.listsCache$),
      filter(([listId, listCache]) => !!listCache[listId]),
      map(([listId, listCache]) => listCache[listId])
    );
  }

  private getHttpLists(listIds: string[]) {
    return from(listIds).pipe(
      withLatestFrom(this.listsCache$),
      filter(([listId, listCache]) => !listCache[listId]),
      map(([listId, _]) => listId),
      bufferTime(50, null, 5),
      mergeMap(ids =>
        iif(
          () => !!ids.length,
          ajax(this.buildListUri(ids)).pipe(
            map(response => response.response as List[]),
            switchMap(lists =>
              from(lists).pipe(tap(list => this.innerListCache$.next(list)))
            )
          ),
          empty()
        )
      )
    );
  }

  private buildListUri(listIds: string[]): string {
    // return listsUrls[0];
    const yt = encodeURIComponent(
      listIds.map(listId => `${listId}|page_size=24`).join(',')
    );
    return `https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp,ldp&ids=${yt}&segments=globo,trial&sub=Subscriber`;
  }
}
