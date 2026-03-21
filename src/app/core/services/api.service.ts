import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/app.tokens';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string
  ) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.buildUrl(path));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body);
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.buildUrl(path), body);
  }

  private buildUrl(path: string): string {
    return `${this.apiBaseUrl}/${path.replace(/^\//, '')}`;
  }
}
