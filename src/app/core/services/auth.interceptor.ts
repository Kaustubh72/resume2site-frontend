import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_ROUTES } from '../config/api-routes';
import { AuthSessionService } from './auth-session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSession = inject(AuthSessionService);
  const token = authSession.getToken();

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
