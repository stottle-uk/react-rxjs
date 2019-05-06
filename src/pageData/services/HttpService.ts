import { empty, Observable } from 'rxjs';
import { ajax, AjaxError } from 'rxjs/ajax';
import { catchError, delay } from 'rxjs/operators';

export class HttpService {
  private readonly baseUrl = 'https://cdn.telecineplay.com.br/api';
  // private readonly baseUrl = 'https://demo-cdn.massiveaxis.com/api';

  get<T>(url: string): Observable<T> {
    const newUrl = `${this.baseUrl}${url}`;
    return ajax.getJSON<T>(newUrl).pipe(
      delay(2000),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: AjaxError): Observable<any> {
    console.log(error.response);
    return empty();
  }
}
