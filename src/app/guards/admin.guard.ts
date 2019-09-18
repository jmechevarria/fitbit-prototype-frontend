import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AdminGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userRole: number;
    return this.authenticationService.currentUser$.pipe(
      map(user => {
        //there has to be a user logged in for this to work, we make sure of that by
        //running the 'user-authenticatioin' guard before this one
        userRole = user.data.roleID;
        if (userRole !== 1) {
          this.router.navigate([""]);
          return false;
        }

        return true;
      })
    );
  }
}
