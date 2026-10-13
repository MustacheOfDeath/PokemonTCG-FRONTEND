import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminBlockGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (isAdmin) {
    router.navigate(['/admin']);
    return false;
  }

  return true;
};

export const adminOnlyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
