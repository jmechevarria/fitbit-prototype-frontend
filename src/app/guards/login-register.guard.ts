import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root"
})
export class LoginRegisterGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve: Function, reject: Function) => {
      const currentUser = this.authenticationService.currentUser;

      if (currentUser) {
        // logged in so redirect to home page
        this.router.navigate(["/"]);
        reject(false);
        return;
      }

      resolve(true);
      return;
    });
  }
}
