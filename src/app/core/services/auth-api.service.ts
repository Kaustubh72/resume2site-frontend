import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly api: ApiService) {}

  login(payload: { email: string; password: string }): Observable<{ token: string }> {
    return this.api.post<{ token: string }>('/auth/login', payload);
  }

  signup(payload: { email: string; password: string; fullName: string }): Observable<{ token: string }> {
    return this.api.post<{ token: string }>('/auth/signup', payload);
  }
}
