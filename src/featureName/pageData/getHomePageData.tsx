import { from, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { PageEntry } from '../Testdata';

export function getHomePageData(): Observable<PageEntry> {
  return ajax(pageUrl).pipe(
    map(response => response.response as PageEntry),
    switchMap(pageEntry =>
      from(listsUrls).pipe(
        mergeMap(listUrl =>
          ajax(listUrl).pipe(
            map(map => map.response as any[]),
            map(lists => ({
              ...pageEntry,
              entries: mapEntries(pageEntry, lists)
            }))
          )
        )
      )
    )
  );

  function mapEntries(pageEntry: PageEntry, lists: any[]) {
    return pageEntry.entries.map(e => {
      const list = lists.find(l => e.list.id === l.id);
      if (list) {
        e.list = { ...e.list, ...list };
      }
      return e;
    });
  }
}

const listsUrls = [
  'https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp%2Cldp&ids=10305%7Cpage_size%3D24%2C10306%7Cpage_size%3D24%2C10681%7Cpage_size%3D24%2C10860%7Cpage_size%3D24%2C10867%7Cpage_size%3D24&segments=globo%2Ctrial&sub=Subscriber',
  'https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp%2Cldp&ids=11028%7Cpage_size%3D24%2C11798%7Cpage_size%3D24%2C11799%7Cpage_size%3D24%2C12567%7Cpage_size%3D24%2C1303%7Cpage_size%3D24&segments=globo%2Ctrial&sub=Subscriber',
  'https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp%2Cldp&ids=3028%7Cpage_size%3D24%2C3032%7Cpage_size%3D24%2C3034%7Cpage_size%3D24%2C6435%7Cpage_size%3D24%2C7727%7Cpage_size%3D24&segments=globo%2Ctrial&sub=Subscriber',
  'https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp%2Cldp&ids=7728%7Cpage_size%3D24%2C7737%7Cpage_size%3D24%2C7959%7Cpage_size%3D24%2C8161%7Cpage_size%3D24%2C8516%7Cpage_size%3D24&segments=globo%2Ctrial&sub=Subscriber',
  'https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp%2Cldp&ids=8665%7Cpage_size%3D24%2C8666%7Cpage_size%3D24%2C8668%7Cpage_size%3D24%2C8706%7Cpage_size%3D24%2C8716%7Cpage_size%3D24&segments=globo%2Ctrial&sub=Subscriber',
  'https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp%2Cldp&ids=9325%7Cpage_size%3D24%2C9326%7Cpage_size%3D24%2C9599%7Cpage_size%3D24%2C9824%7Cpage_size%3D24%2C9920%7Cpage_size%3D24&segments=globo%2Ctrial&sub=Subscriber',
  'https://cdn.telecineplay.com.br/api/lists?device=web_browser&ff=idp%2Cldp&ids=9921%7Cpage_size%3D24&segments=globo%2Ctrial&sub=Subscriber'
];

const pageUrl =
  'https://cdn.telecineplay.com.br/api/page?device=web_browser&ff=idp%2Cldp&list_page_size=24&max_list_prefetch=3&path=%2F&segments=globo%2Ctrial&sub=Subscriber&text_entry_format=html';
