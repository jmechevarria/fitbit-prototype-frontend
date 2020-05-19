import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/User";
import { AuthenticationService } from "src/app/services/authentication.service";
import { RESPONSES, ROLES } from "src/app/helpers/Constants";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  inReview = false;
  serverSideError = false;
  serverSideErrorMessage = "";
  showPassword: boolean = false;
  user: any = new User();

  constructor(
    private translate: TranslateService,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.user = { ...this.authenticationService.currentUser }; //this.user = user; NO NO
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onSubmit() {
    const { clientAccounts, ...rest } = this.user;

    const sub = this.userService.patch(rest).subscribe(
      () => {
        delete this.user.password;

        this.authenticationService.currentUser = this.user;

        if (this.user.role_id === ROLES.ADMIN) this.router.navigate(["/admin"]);
        else if (this.user.role_id === ROLES.CAREGIVER)
          this.router.navigate(["/dashboard"]);
        else this.router.navigate(["/"]);
      },
      (error) => {
        this.inReview = false;
        this.serverSideError = true;
        if (error.id === RESPONSES.UNIQUE_CONSTRAINT.id) {
          this.serverSideErrorMessage = `${this.translate.instant(
            "forms.field_names." + error.entity
          )} ${this.translate.instant("forms.errors.unique_constraint_field", {
            field_value: `'${this.user[error.entity]}'`,
          })}`;
        }
      }
    );

    this.subscriptions.push(sub);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
