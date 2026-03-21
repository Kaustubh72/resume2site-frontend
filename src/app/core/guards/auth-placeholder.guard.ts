import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';

export const authPlaceholderGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authSession = inject(AuthSessionService);

  if (authSession.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth'], {
    queryParams: { next: '/dashboard' }
  });
};
