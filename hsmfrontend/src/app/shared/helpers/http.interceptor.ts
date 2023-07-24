import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../hsm/services/error.handler.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService, public router: Router, private errHandler: ErrorHandlerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(catchError(x=> this.handleAuthError(x)));
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        let errmsg = "";

        this.errHandler.handleError(err);
    
        if (err.status === 401 || err.status === 403) {
            // this.authenticationService.logout();
            return of(err.message); // or EMPTY may be appropriate here
        }
        else if(err.status === 400) {
            errmsg = err.error.message;
       }
        return throwError(errmsg);
    }
}