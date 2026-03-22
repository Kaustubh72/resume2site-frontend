import { Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly storageKey = STORAGE_KEYS.authToken;
  private readonly tokenState = signal<string | null>(this.readToken());

  readonly token = this.tokenState.asReadonly();

  isAuthenticated(): boolean {
    return !!this.tokenState();
  }

  getToken(): string | null {
    return this.tokenState();
  }

  setToken(token: string): void {
    this.tokenState.set(token);
    localStorage.setItem(this.storageKey, token);
  }

  clearToken(): void {
    this.tokenState.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private readToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.storageKey);
  }
}
