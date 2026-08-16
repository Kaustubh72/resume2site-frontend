import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../config/app.tokens';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string
  ) {}

  get<T>(path: string, options?: { headers?: HttpHeaders | Record<string, string> }): Observable<T> {
    return this.http.get<any>(this.buildUrl(path), options).pipe(
      map((resp) => (resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp))
    );
  }

  post<T>(path: string, body: unknown, options?: { headers?: HttpHeaders | Record<string, string> }): Observable<T> {
    return this.http.post<any>(this.buildUrl(path), body, options).pipe(
      map((resp) => (resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp))
    );
  }

  patch<T>(path: string, body: unknown, options?: { headers?: HttpHeaders | Record<string, string> }): Observable<T> {
    return this.http.patch<any>(this.buildUrl(path), body, options).pipe(
      map((resp) => (resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp))
    );
  }

  put<T>(path: string, body: unknown, options?: { headers?: HttpHeaders | Record<string, string> }): Observable<T> {
    return this.http.put<any>(this.buildUrl(path), body, options).pipe(
      map((resp) => (resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp))
    );
  }

  delete<T>(path: string, options?: { headers?: HttpHeaders | Record<string, string> }): Observable<T> {
    return this.http.delete<any>(this.buildUrl(path), options).pipe(
      map((resp) => (resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp))
    );
  }

  private buildUrl(path: string): string {
    return `${this.apiBaseUrl}/${path.replace(/^\//, '')}`;
  }
}
