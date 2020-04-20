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
import { RESPONSES } from "./Constants";

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
          if (err.error.id === RESPONSES.INSUFFICIENT_PRIVILEGES.id)
            this.router.navigate([""]);
          else if (
            err.error.id === RESPONSES.EXPIRED_TOKEN.id ||
            err.error.id === RESPONSES.INVALID_TOKEN.id
          )
            this.authenticationService.logout(err.error);
        }

        return throwError(err.error || err.statusText);
      })
    );
  }
}
