import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root"
})
export class CaregiverGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authenticationService.isAuthenticated) {
      // not logged in so redirect to login page with the return url
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    return this.authenticationService.currentUser$.pipe(
      map(user => {
        if (user.role_id !== 2) {
          this.router.navigate([""]);
          return false;
        }

        return true;
      })
    );
  }
}
