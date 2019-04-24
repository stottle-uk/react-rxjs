import { empty, Observable } from 'rxjs';
import { ajax, AjaxError } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';

export class HttpService {
  private readonly baseUrl = 'https://cdn.telecineplay.com.br/api';

  get<T>(url: string): Observable<T> {
    const newUrl = `${this.baseUrl}${url}`;
    return ajax.getJSON<T>(newUrl).pipe(
      map(response => response as T),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: AjaxError): Observable<any> {
    console.log(error.response);
    return empty();
  }
}
