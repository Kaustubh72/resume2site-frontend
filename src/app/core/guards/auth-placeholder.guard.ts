import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authPlaceholderGuard: CanActivateFn = () => {
  const router = inject(Router);
  return router.createUrlTree(['/auth'], {
    queryParams: { next: '/dashboard' }
  });
};
