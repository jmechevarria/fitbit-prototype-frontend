import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root"
})
export class CaregiverGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

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
        if (userRole !== 2) {
          this.router.navigate([""]);
          return false;
        }

        return true;
      })
    );
  }
}
