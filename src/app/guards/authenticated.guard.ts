import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({ providedIn: "root" })
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve: Function, reject: Function) => {
      if (this.authenticationService.isAuthenticated) {
        resolve(true);
        return;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url }
      });

      reject(false);
      return;
    });
  }
}
