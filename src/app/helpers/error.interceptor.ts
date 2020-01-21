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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          // alert("error");

          //I DON'T THINK THE USER SHOULD BE LOGGED OUT ON A 401 STATUS, JUST REDIRECTED TO HOME
          //check if request comes from fitbit, if so don't redirect
          if (!request.url.match("fitbit.com")) {
            this.router.navigate([""]);
          } else {
            console.log(request.body);
            alert("error");
          }
        }

        const error = err.error || err.statusText;
        return throwError(error);
      })
    );
  }
}
