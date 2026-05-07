import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && authService.isAuthenticated() && !req.url.includes('/auth/refresh')) {
        // Try refreshing token
        return authService.refreshToken().pipe(
          switchMap(() => {
            const currentUser = authService.currentUserValue;
            if (currentUser && currentUser.accessToken) {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${currentUser.accessToken}`
                }
              });
              return next(retryReq);
            }
            return throwError(() => err);
          }),
          catchError((refreshErr) => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }
      
      return throwError(() => formatHttpError(err));
    })
  );
};

function formatHttpError(err: HttpErrorResponse): string {
  const payload = err.error;

  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const message = payload.message || payload.error || payload.detail;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      const firstError = payload.errors[0];
      if (typeof firstError === 'string') {
        return firstError;
      }
      if (firstError && typeof firstError === 'object' && typeof firstError.message === 'string') {
        return firstError.message;
      }
    }
  }

  if (typeof err.statusText === 'string' && err.statusText.trim()) {
    return err.statusText;
  }

  return 'Login failed. Please check your email and password.';
}
