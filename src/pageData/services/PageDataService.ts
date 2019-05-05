import { from, Observable, OperatorFunction, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { List, PageEntry } from '../models/pageEntry';
import { ListsService } from './ListsService';
import { PagesService } from './PagesService';

export class PageDataService {
  private innerPath$ = new Subject<string>();

  get path$(): Observable<string> {
    return this.innerPath$.asObservable();
  }

  get currentPage$(): Observable<PageEntry> {
    return this.path$.pipe(
      switchMap(path => this.pages.getPageEntry(path)),
      this.queueLists()
    );
  }

  constructor(private pages: PagesService, private lists: ListsService) {}

  getHomePageData(path: string): void {
    this.innerPath$.next(path);
  }

  private queueLists(): OperatorFunction<PageEntry, PageEntry> {
    return source =>
      source.pipe(
        switchMap(page =>
          this.getLists(page).pipe(
            tap(list => this.lists.queueList(list)),
            map(() => page)
          )
        )
      );
  }

  private getLists(pageEntry: PageEntry): Observable<List> {
    const entryLists = pageEntry.entries
      ? pageEntry.entries
          .filter(e => e.list)
          .filter(e => +e.list.id > 0)
          .map(e => e.list)
      : [];

    const lists =
      !!pageEntry.list && +pageEntry.list.id > 0
        ? [pageEntry.list, ...entryLists]
        : entryLists;

    return from(lists);
  }
}
