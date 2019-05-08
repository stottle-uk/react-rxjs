import {
  BehaviorSubject,
  combineLatest,
  Observable,
  OperatorFunction,
  Subject
} from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  Dictionary,
  List,
  PageEntry,
  PageTemplateData,
  Paging
} from '../models/pageEntry';
import { ListsService } from './ListsService';
import { PagesService } from './PagesService';

export class PageDataService {
  private innerPath$ = new Subject<string>();
  private innerLoading$ = new BehaviorSubject<boolean>(false);

  private get loading$(): Observable<boolean> {
    return this.innerLoading$.asObservable();
  }

  private get path$(): Observable<string> {
    return this.innerPath$.asObservable();
  }

  private get currentPage$(): Observable<PageEntry> {
    return this.path$.pipe(
      this.setLoadingStatus(true),
      switchMap(path => this.pages.getPageEntry(path)),
      this.queueLists(),
      this.setLoadingStatus(false)
    );
  }

  get lists$(): Observable<Dictionary<List>> {
    return this.lists.lists$;
  }

  get pageData$(): Observable<PageTemplateData> {
    return combineLatest(this.currentPage$, this.lists$, this.loading$).pipe(
      map(([pageEntry, lists, loading]) => ({
        loading,
        pageEntry,
        lists
      }))
    );
  }

  constructor(private pages: PagesService, private lists: ListsService) {}

  getPageData(path: string): void {
    this.innerPath$.next(path);
  }

  getMoreListItems(paging: Paging): void {
    this.lists.getMore(paging);
  }

  private queueLists(): OperatorFunction<PageEntry, PageEntry> {
    return source =>
      source.pipe(
        tap(page =>
          this.getLists(page).forEach(list => this.lists.queueList(list))
        )
      );
  }

  private setLoadingStatus<T>(loading: boolean): OperatorFunction<T, T> {
    return source => source.pipe(tap(() => this.innerLoading$.next(loading)));
  }

  private getLists(pageEntry: PageEntry): List[] {
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
