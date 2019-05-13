import { empty, Observable } from 'rxjs';
import { ajax, AjaxError } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import { baseApiUrl } from '../env';

export class HttpService {
  private readonly baseUrl = baseApiUrl;

  get<T>(url: string): Observable<T> {
    const newUrl = `${this.baseUrl}${url}`;
    return ajax.getJSON<T>(newUrl).pipe(
      // delay(2000),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: AjaxError): Observable<any> {
    console.log(error);
    return empty();
  }
}
