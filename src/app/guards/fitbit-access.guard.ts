import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { FitbitDataService } from "../services/fitbit-data.service";

@Injectable({
  providedIn: "root"
})
export class FitbitAccessGuard implements CanActivate {
  constructor(private router: Router, private fitbitDataService: FitbitDataService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let a: boolean = this.fitbitDataService.appHasAccess();
    console.log(a);
    return a;
  }
}
