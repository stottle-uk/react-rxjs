import {
  BehaviorSubject,
  combineLatest,
  Observable,
  OperatorFunction,
  throwError
} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BrowserHistory } from '../../router/services/BrowserHistory';
import { List, PageEntry, PageTemplateData } from '../models/pageEntry';
import { ListsService } from './ListsService';
import { PagesService } from './PagesService';

export class PageDataService {
  private innerLoading$ = new BehaviorSubject<boolean>(false);

  private get loading$(): Observable<boolean> {
    return this.innerLoading$.asObservable();
  }

  private get currentPage$(): Observable<PageEntry> {
    return this.history.activatedPath$.pipe(
      this.setLoadingStatus(true),
      this.getPageEntry(),
      this.queueLists(),
      this.setLoadingStatus(false)
    );
  }

  get pageData$(): Observable<PageTemplateData> {
    return combineLatest(
      this.currentPage$,
      this.lists.lists$,
      this.loading$,
      this.lists.loading$
    ).pipe(
      map(([pageEntry, lists, loading, listsLoading]) => ({
        loading,
        pageEntry,
        lists,
        listsLoading
      })),
      catchError(error => throwError(error).pipe(this.setLoadingStatus(false)))
    );
  }

  constructor(
    private history: BrowserHistory,
    private pages: PagesService,
    private lists: ListsService
  ) {}

  private setLoadingStatus<T>(loading: boolean): OperatorFunction<T, T> {
    return source => source.pipe(tap(() => this.innerLoading$.next(loading)));
  }

  private getPageEntry(): OperatorFunction<string, PageEntry> {
    return source =>
      source.pipe(switchMap(path => this.pages.getPageEntry(path)));
  }

  private queueLists(): OperatorFunction<PageEntry, PageEntry> {
    return source =>
      source.pipe(
        tap(page =>
          this.findListsInPage(page).forEach(list => this.lists.queueList(list))
        )
      );
  }

  private findListsInPage(pageEntry: PageEntry): List[] {
    const entryLists = pageEntry.entries
      ? pageEntry.entries
          .filter(e => e.list)
          .filter(e => e.type !== 'UserEntry')
          .map(e => e.list)
      : [];

    const lists =
      !!pageEntry.list && +pageEntry.list.id > 0
        ? [pageEntry.list, ...entryLists]
        : entryLists;

    return lists;
  }
}
