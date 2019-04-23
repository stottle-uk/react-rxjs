import { merge, Observable, of, ReplaySubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  filter,
  map,
  scan,
  startWith,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { PageEntry } from '../Testdata';

export interface Dictionary<T> {
  [key: string]: T;
}

export class PagesService {
  private innerPageCache$ = new ReplaySubject<PageEntry>();

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
    return merge(this.getHttpPage(path), this.getCachedPage(path));
  }

  private getCachedPage(path: string) {
    return of(path).pipe(
      withLatestFrom(this.pageCache$),
      filter(([path, pageCache]) => !!pageCache[path]),
      map(([path, pageCache]) => pageCache[path])
    );
  }

  private getHttpPage(path: string) {
    return of(path).pipe(
      withLatestFrom(this.pageCache$),
      filter(([path, pageCache]) => !pageCache[path]),
      map(([path, _]) => path),
      switchMap(path =>
        ajax(this.buildPageUrl(path)).pipe(
          map(response => response.response),
          tap(page => this.innerPageCache$.next(page))
        )
      )
    );
  }

  private buildPageUrl(path: string): string {
    const encodePath = encodeURIComponent(path);

    return `https://cdn.telecineplay.com.br/api/page?device=web_browser&ff=idp%2Cldp&list_page_size=24&max_list_prefetch=3&path=${encodePath}&segments=globo%2Ctrial&sub=Subscriber&text_entry_format=html`;
  }
}