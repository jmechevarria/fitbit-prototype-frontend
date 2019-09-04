import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { FitbitService } from "../services/fitbit.service";

@Injectable({
  providedIn: "root"
})
export class FitbitAccessGuard implements CanActivate {
  constructor(
    private router: Router,
    private fitbitDataService: FitbitService,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const appHasAccess = this.fitbitDataService.appHasAccess();
    const isAuthenticated = this.authenticationService.isAuthenticated;

    if (!isAuthenticated || !appHasAccess) this.router.navigate(["/"]);

    return appHasAccess && isAuthenticated;
  }
}
