import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Manually handling http-requests
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, httpOptions: object = {}): Promise<HttpResponse<T>> {
    return this.withErrorHandling(
      this.http.get<T>(`${environment.APP_BASE_URL}/${url}`, {
        ...httpOptions,
        observe: 'response',
      }),
      [200],
    );
  }

  post<T>(
    url: string,
    body: any | null = null,
    httpOptions: object = {},
  ): Promise<HttpResponse<T>> {
    return this.withErrorHandling(
      this.http.post<T>(`${environment.APP_BASE_URL}/${url}`, body, {
        ...httpOptions,
        observe: 'response',
      }),
      [200, 201],
    );
  }

  put<T>(
    url: string,
    body: any | null = null,
    httpOptions: object = {},
  ): Promise<HttpResponse<T>> {
    return this.withErrorHandling(
      this.http.put<T>(`${environment.APP_BASE_URL}/${url}`, body, {
        ...httpOptions,
        observe: 'response',
      }),
      [200],
    );
  }

  delete<T>(
    url: string,
    httpOptions: object = {},
  ): Promise<HttpResponse<T>> {
    return this.withErrorHandling(
      this.http.delete<T>(`${environment.APP_BASE_URL}/${url}`, {
        ...httpOptions,
        observe: 'response',
      }),
      [200],
    );
  }

  private withErrorHandling<T>(request: Observable<HttpResponse<T>>, allowedStatuses: number[]) {
    return request.toPromise().then(
      (response: HttpResponse<T>) => {
        if (response) {
          if (!allowedStatuses.includes(response.status)) {
            throw response;
          }
        }

        return response as HttpResponse<T>;
      },
      async (reason: any) => {
        const error = reason as HttpErrorResponse;
        throw error;
      },
    );
  }
}
