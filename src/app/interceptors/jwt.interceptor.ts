import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  console.log('🔵 JWT Interceptor ejecutado');
  console.log('📍 URL:', request.url);

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  console.log('🔑 Token existe?', token ? 'SÍ' : 'NO');

  const isAuthEndpoint =
    request.url.includes('/auth/login') ||
    request.url.includes('/auth/register');

  if (token && !isAuthEndpoint) {
    console.log('✅ Agregando token');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('❌ Error HTTP:', error.status);

      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      if (error.status === 403) {
        alert('No tienes permisos');
      }

      return throwError(() => error);
    })
  );
};
