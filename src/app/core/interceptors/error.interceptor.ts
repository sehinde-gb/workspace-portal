import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP error:', error.status);

      if (error.status === 401) {
        router.navigate(['/login']);
      } else if (error.status === 500) {
       notificationService.showError('Something went wrong. Please try again');
      }
      return throwError(() => error);
    })
  );
};
