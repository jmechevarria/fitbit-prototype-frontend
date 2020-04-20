import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ProfileGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!this.authenticationService.isAuthenticated) {
        // not logged in so redirect to login page with the return url
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        reject(false);
      }

      if (
        this.authenticationService.currentUser$.pipe(
          map(user => {
            if (user.role_id !== 1) {
              this.router.navigate([""]);
              return false;
            }

            return true;
          })
        )
      ) {
        resolve(true);
        return;
      } else {
        reject(false);
        return;
      }
    });
  }
}
