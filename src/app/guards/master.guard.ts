import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";

import { LoginRegisterGuard } from "./login-register.guard";
import { AdminGuard } from "./admin.guard";
import { GUARDS } from "../helpers/Constants";
import { AuthenticationService } from "../services/authentication.service";
import { AuthenticatedGuard } from "./authenticated.guard";

@Injectable({
  providedIn: "root"
})
export class MasterGuard implements CanActivate {
  private next: ActivatedRouteSnapshot;
  private state: RouterStateSnapshot;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    this.next = next;
    this.state = state;

    if (!next.data || !this.next.data.guards || !this.next.data.guards.length) {
      return Promise.resolve(true);
    }

    return this.executeGuards();
  }

  private executeGuards(guardIndex: number = 0): Promise<boolean> {
    return this.activateGuard(this.next.data.guards[guardIndex])
      .then(() => {
        if (this.next.data.guards[guardIndex + 1]) {
          return this.executeGuards(guardIndex + 1);
        } else {
          return Promise.resolve(true);
        }
      })
      .catch(() => {
        return Promise.reject(false);
      });
  }

  //Create an instance of the guard and fire canActivate method returning a promise
  private activateGuard(guardKey: number): Promise<boolean> {
    let guard: LoginRegisterGuard | AdminGuard | AuthenticatedGuard;

    switch (guardKey) {
      case GUARDS.LoginRegister:
        guard = new LoginRegisterGuard(this.router, this.authenticationService);
        break;
      case GUARDS.Admin:
        guard = new AdminGuard(this.router, this.authenticationService);
        break;
      case GUARDS.AuthenticatedGuard:
        guard = new AuthenticatedGuard(this.router, this.authenticationService);
        break;
      default:
        break;
    }

    return guard.canActivate(this.next, this.state);
  }
}
