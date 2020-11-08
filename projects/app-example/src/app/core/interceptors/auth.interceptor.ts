import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { tap, delay, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Get the auth header (fake value is shown here)
    const authHeader = '49a5kdkv409fd39'; // this.authService.getAuthHeader();
    const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
    //return next.handle(authReq);

    return next
          .handle(authReq)
          .pipe(
            // handle 401 here
            catchError(err => {
              if (err.status === 401) {
                this.router.navigate(['/login']);
              }
              return Observable.throw(err || 'Server error');
            })
          );
  }
}
