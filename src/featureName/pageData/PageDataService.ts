import {
  BehaviorSubject,
  combineLatest,
  from,
  iif,
  Observable,
  of
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  bufferTime,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { List, PageEntry } from '../Testdata';

export class PageDataService {
  private innerPages$ = new BehaviorSubject<PageEntry[]>([]);
  private innerLists$ = new BehaviorSubject<List[]>([]);
  private innerCurrentPath$ = new BehaviorSubject<string>('');

  get pages$(): Observable<PageEntry[]> {
    return this.innerPages$.asObservable();
  }

  get lists$(): Observable<List[]> {
    return this.innerLists$.asObservable();
  }

  get currentPath$(): Observable<string> {
    return this.innerCurrentPath$.asObservable().pipe(filter(path => !!path));
  }

  get currentPage$(): Observable<PageEntry> {
    return combineLatest(this.currentPath$, this.pages$).pipe(
      map(([path, pages]) => pages.find(p => p.path === path) as PageEntry),
      filter(page => !!page)
    );
  }

  getHomePageData(path: string): Observable<PageEntry> {
    this.innerCurrentPath$.next(path);

    return combineLatest(this.getPageEntry(), this.getLists()).pipe(
      switchMap(stuff =>
        combineLatest(this.currentPage$, this.lists$).pipe(
          map(([pageEntry, lists]) => ({
            ...pageEntry,
            entries: this.mapEntries(pageEntry, lists)
          }))
        )
      )
    );
  }

  private getPageEntry(): Observable<PageEntry> {
    return this.currentPath$.pipe(
      take(1),
      switchMap(path =>
        ajax(buildPageUrl(path)).pipe(
          map(response => response.response as PageEntry),
          tap(pageEntry =>
            this.innerPages$.next([...this.innerPages$.value, pageEntry])
          )
        )
      )
    );
  }

  private getLists(): Observable<List[]> {
    return this.currentPage$.pipe(
      take(1),
      switchMap(page =>
        this.queueGetList(page).pipe(
          mergeMap(listIds =>
            iif(() => !!listIds.length, this.getListsAcc(listIds), of([]))
          )
        )
      )
    );
  }

  private getListsAcc(listIds: string[]): Observable<List[]> {
    return ajax(this.buildListUri(listIds)).pipe(
      map(map => map.response as List[]),
      mergeMap(lists =>
        from(lists).pipe(
          tap(list => this.innerLists$.next([...this.innerLists$.value, list])),
          map(() => lists)
        )
      )
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

  private mapEntries(pageEntry: PageEntry, lists: List[]) {
    return pageEntry.entries.map(e => {
      const list = lists.find(l => e.list && e.list.id === l.id);
      if (list) {
        e.list = { ...e.list, ...list };
      }
      return e;
    });
  }
}

function buildPageUrl(path: string): string {
  const encodePath = encodeURIComponent(path);

  return `https://cdn.telecineplay.com.br/api/page?device=web_browser&ff=idp%2Cldp&list_page_size=24&max_list_prefetch=3&path=${encodePath}&segments=globo%2Ctrial&sub=Subscriber&text_entry_format=html`;
}
