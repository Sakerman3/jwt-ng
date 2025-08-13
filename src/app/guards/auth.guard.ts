import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  // On the server, always allow; defer redirects until client hydration
  if (!isPlatformBrowser(platformId)) return true;

  if (auth.isAuthenticated) return true;
  router.navigate(['/login']);
  return false;
};
