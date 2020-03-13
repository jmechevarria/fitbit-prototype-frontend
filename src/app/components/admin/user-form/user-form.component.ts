import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "src/app/services/user.service";
import { RoleService } from "src/app/services/role.service";
import { Role } from "src/app/models/Role";
import { User } from "src/app/models/User";
import { UserFactory } from "src/app/models/UserFactory";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"]
})
export class UserFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  editForm = false;
  inReview = false;
  serverSideError = false;
  serverSideErrorMessage = "";
  formHeader;
  roles: Role[] = [];

  user: any = new User();

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.editForm = this.activatedRoute.snapshot.url[1].toString() === "edit";

    const sub = this.activatedRoute.paramMap.subscribe((params: Params) => {
      if (!this.editForm) {
        this.user = UserFactory.createUser(
          parseInt(this.activatedRoute.snapshot.url[2].toString())
        );

        const sub = this.translate
          .get("shared.new_user")
          .subscribe(translated => {
            this.formHeader = translated;
          });

        this.subscriptions.push(sub);
      } else {
        const sub = this.translate
          .get("forms.user.edit_user")
          .subscribe(translated => {
            this.formHeader = translated;
          });
        this.subscriptions.push(sub);

        //get user
        const sub2 = this.userService
          .getByID(params.params.id, params.params.role_id)
          .subscribe(response => {
            this.user = UserFactory.createUser(
              parseInt(this.activatedRoute.snapshot.url[2].toString()),
              response
            );
          });
        this.subscriptions.push(sub2);
      }
    });

    const sub2 = this.roleService.get().subscribe(response => {
      this.roles = response;
    });

    this.subscriptions.push(sub, sub2);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSubmit() {
    let sub;
    if (!this.editForm)
      sub = this.userService.create(this.user).subscribe(
        () => {
          this.router.navigate(["/admin"]);
        },
        error => {
          this.inReview = false;
          this.serverSideError = true;
          if (error.id === "UNIQUE_CONSTRAINT") {
            this.serverSideErrorMessage = `${this.translate.instant(
              "forms.field_names." + error.entity
            )} ${this.translate.instant(
              "forms.errors.unique_constraint_field",
              {
                field_value: `'${this.user[error.entity]}'`
              }
            )}`;
          }
        }
      );
    else
      sub = this.userService.patch(this.user).subscribe(
        () => {
          this.router.navigate(["/admin"]);
        },
        error => {
          this.inReview = false;
          this.serverSideError = true;
          if (error.id === "UNIQUE_CONSTRAINT") {
            this.serverSideErrorMessage = `${this.translate.instant(
              "forms.field_names." + error.entity
            )} ${this.translate.instant(
              "forms.errors.unique_constraint_field",
              {
                field_value: `'${this.user[error.entity]}'`
              }
            )}`;
          }
        }
      );

    this.subscriptions.push(sub);
  }
}
