import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";
import { FitbitService } from "../services/fitbit.service";
import { environment } from "src/environments/environment";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private fitbitService: FitbitService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          // alert("error");

          //I DON'T THINK THE USER SHOULD BE LOGGED OUT ON A 401 STATUS, JUST REDIRECTED TO HOME
          //check if request comes from fitbit, if so don't redirect
          if (!request.url.match("fitbit.com")) {
            this.router.navigate([""]);
          } else {
            //request fitbit credentials again
            this.fitbitService.requestAccess();
          }
        }
        // alert(err);
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
