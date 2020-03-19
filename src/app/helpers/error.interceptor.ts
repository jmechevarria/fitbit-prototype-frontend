import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { ERRORS } from "./Constants";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          console.log(err.error);
          if (err.error.id === ERRORS.INSUFFICIENT_PRIVILEGES.id)
            this.router.navigate([""]);
          else if (err.error.id === ERRORS.TOKEN_EXPIRED.id)
            this.authenticationService.logout(ERRORS.TOKEN_EXPIRED);
        }

        return throwError(err.error || err.statusText);
      })
    );
  }
}
