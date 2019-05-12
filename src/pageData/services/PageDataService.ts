import {
  BehaviorSubject,
  combineLatest,
  Observable,
  OperatorFunction
} from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BrowserHistory } from '../../router/services/BrowserHistory';
import { List, PageEntry, PageTemplateData, Paging } from '../models/pageEntry';
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
      this.loading$
    ).pipe(
      map(([pageEntry, lists, loading]) => ({
        loading,
        pageEntry,
        lists
      }))
    );
  }

  constructor(
    private history: BrowserHistory,
    private pages: PagesService,
    private lists: ListsService
  ) {}

  getMoreListItems(paging: Paging): void {
    this.lists.getMore(paging);
  }

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
