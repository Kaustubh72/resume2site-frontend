import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { API_ROUTES } from '../config/api-routes';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly api: ApiService) {}

  login(payload: { email: string; password: string }): Observable<{ token: string }> {
    return this.api.post(API_ROUTES.auth.login, payload).pipe(
      map((resp: any) => ({ token: resp?.accessToken ?? resp?.token }))
    );
  }

  signup(payload: { email: string; password: string; fullName?: string }): Observable<{ token: string }> {
    return this.api.post(API_ROUTES.auth.signup, payload).pipe(
      map((resp: any) => ({ token: resp?.accessToken ?? resp?.token }))
    );
  }

  me(): Observable<{ id: string; email: string; fullName: string }> {
    return this.api.get<{ id: string; email: string; fullName: string }>(API_ROUTES.auth.me);
  }
}
