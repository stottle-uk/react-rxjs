import { combineLatest, from, iif, Observable, of, ReplaySubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
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

export interface Dictionary<T> {
  [key: string]: T;
}

export class PageDataService {
  private innerPage$ = new ReplaySubject<PageEntry>();

  get pages$(): Observable<Dictionary<PageEntry>> {
    return this.innerPage$.pipe(
      map(page => ({
        [page.path]: page
      })),
      scan(
        (acc, curr) => ({
          ...acc,
          ...curr
        }),
        {} as Dictionary<PageEntry>
      )
    );
  }

  get lists$(): Observable<Dictionary<List>> {
    return this.innerPage$.pipe(
      switchMap(page =>
        this.queueGetList(page).pipe(
          mergeMap(listIds =>
            iif(() => !!listIds.length, this.getListsAcc(listIds), of())
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
    const pageEntry$ = this.getPageEntry(path).pipe(
      tap(page => this.innerPage$.next(page))
    );
    const lists$ = this.lists$.pipe(startWith({}));

    return combineLatest(pageEntry$, lists$).pipe(
      map(([page, lists]) => ({
        ...page,
        entries: this.mapEntries(page, lists)
      })),
      distinctUntilChanged()
    );
  }

  private getPageEntry(path: string): Observable<PageEntry> {
    return ajax(buildPageUrl(path)).pipe(
      map(response => response.response as PageEntry)
    );
  }

  private getListsAcc(listIds: string[]): Observable<List[]> {
    return ajax(this.buildListUri(listIds)).pipe(
      map(map => map.response as List[])
    );
  }

  private queueGetList(pageEntry: PageEntry): Observable<string[]> {
    return from(this.getEmptyLists(pageEntry)).pipe(
      filter(id => +id > 0),
      bufferTime(100, null, 5)
    );
  }

  private buildListUri(listIds: string[]): string {
    // return listsUrls[0];
    const yt = encodeURIComponent(
      listIds.map(listId => `${listId}|page_size=24`).join(',')
    );
    return `https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp,ldp&ids=${yt}&segments=globo,trial&sub=Subscriber`;
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

function buildPageUrl(path: string): string {
  const encodePath = encodeURIComponent(path);

  return `https://cdn.telecineplay.com.br/api/page?device=web_browser&ff=idp%2Cldp&list_page_size=24&max_list_prefetch=3&path=${encodePath}&segments=globo%2Ctrial&sub=Subscriber&text_entry_format=html`;
}
