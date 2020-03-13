import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { map } from "rxjs/operators";
import { IUser } from "../models/IUser";
import { User } from "../models/User";

@Injectable({
  providedIn: "root"
})
export class AdminGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
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
        if (user.role_id !== 1) {
          this.router.navigate([""]);
          return false;
        }

        return true;
      })
    );
  }
}
