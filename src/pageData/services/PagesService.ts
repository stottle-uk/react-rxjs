import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { PageEntry } from '../models/pageEntry';
import { HttpService } from './HttpService';

export class PagesService {
  private pagesCache: { [key: string]: Observable<PageEntry> } = {};

  constructor(private httpService: HttpService) {}

  getPageEntry(path: string): Observable<PageEntry> {
    this.pagesCache[path] = this.pagesCache[path] || this.getPage(path);
    return this.pagesCache[path];
  }

  private getPage(path: string): Observable<PageEntry> {
    return this.httpService
      .get<PageEntry>(this.buildPageUrl(path))
      .pipe(shareReplay(1));
  }

  private buildPageUrl(path: string): string {
    const encodePath = encodeURIComponent(path);

    return `/page?device=web_browser&ff=idp%2Cldp&list_page_size=24&max_list_prefetch=3&path=${encodePath}&segments=globo%2Ctrial&sub=Subscriber&text_entry_format=html`;
  }
}
