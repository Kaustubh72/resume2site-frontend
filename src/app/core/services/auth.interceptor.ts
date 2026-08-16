import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_ROUTES } from '../config/api-routes';
import { AuthSessionService } from './auth-session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSession = inject(AuthSessionService);
  const token = authSession.getToken();

  // Debug: log outgoing request URL and key headers to help diagnose failing auth calls
  try {
    // Avoid leaking tokens in prod logs; this is temporary for debugging.
    const authHeader = req.headers.get('Authorization');
    const draftHeader = req.headers.get('X-Draft-Token') || req.headers.get('X-Draft-Access-Token');
    // eslint-disable-next-line no-console
    console.debug('[auth-interceptor] outgoing', req.method, req.url, { authorizationPresent: !!authHeader, draftHeaderPresent: !!draftHeader });
  } catch {}

  if (!token) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !req.url.includes(API_ROUTES.auth.login) &&
        !req.url.includes(API_ROUTES.auth.signup)
      ) {
        authSession.clearToken();
      }

      return throwError(() => error);
    })
  );
};
