import { Observable, of, ReplaySubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  map,
  scan,
  startWith,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { List, PageEntry } from '../Testdata';

export interface Dictionary<T> {
  [key: string]: T;
}

export class RocketService {
  private innerPageCache$ = new ReplaySubject<PageEntry>();
  private innerLists$ = new ReplaySubject<List>();

  get pageCache$(): Observable<Dictionary<PageEntry>> {
    return this.innerPageCache$.pipe(
      map(page => ({
        [page.path]: page
      })),
      scan(
        (acc, curr) => ({
          ...acc,
          ...curr
        }),
        {} as Dictionary<PageEntry>
      ),
      startWith({})
    );
  }

  getPageEntry(path: string): Observable<PageEntry> {
    return of(path).pipe(
      withLatestFrom(this.pageCache$),
      switchMap(([path, pageCache]) =>
        this.getPageEntryCheckCache(path, pageCache)
      )
    );
  }

  getLists(listIds: string[]): Observable<List[]> {
    return ajax(this.buildListUri(listIds)).pipe(map(map => map.response));
  }

  getPageEntryCheckCache(
    path: string,
    pageCache: Dictionary<PageEntry>
  ): Observable<PageEntry> {
    const cachedPage = pageCache[path];
    if (cachedPage) {
      return of(cachedPage);
    }
    return ajax(this.buildPageUrl(path)).pipe(
      map(response => response.response),
      tap(page => this.innerPageCache$.next(page))
    );
  }

  private buildListUri(listIds: string[]): string {
    // return listsUrls[0];
    const yt = encodeURIComponent(
      listIds.map(listId => `${listId}|page_size=24`).join(',')
    );
    return `https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp,ldp&ids=${yt}&segments=globo,trial&sub=Subscriber`;
  }

  private buildPageUrl(path: string): string {
    const encodePath = encodeURIComponent(path);

    return `https://cdn.telecineplay.com.br/api/page?device=web_browser&ff=idp%2Cldp&list_page_size=24&max_list_prefetch=3&path=${encodePath}&segments=globo%2Ctrial&sub=Subscriber&text_entry_format=html`;
  }
}
