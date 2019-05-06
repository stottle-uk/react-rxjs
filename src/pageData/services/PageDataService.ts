import {
  combineLatest,
  from,
  iif,
  Observable,
  of,
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

  get path$(): Observable<string> {
    return this.innerPath$.asObservable();
  }

  get currentPage$(): Observable<PageEntry> {
    return this.path$.pipe(
      switchMap(path => this.pages.getPageEntry(path)),
      this.queueLists()
    );
  }

  get lists$(): Observable<Dictionary<List>> {
    return this.lists.lists$;
  }

  get pageData$(): Observable<PageTemplateData> {
    return combineLatest(this.currentPage$, this.lists$).pipe(
      map(([pageEntry, lists]) => ({
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
        switchMap(page =>
          of(page).pipe(
            map(page => this.getLists(page)),
            switchMap(lists =>
              iif(
                () => !!lists.length,
                from(lists).pipe(tap(list => this.lists.queueList(list))),
                of({})
              )
            ),
            map(() => page)
          )
        )
      );
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
