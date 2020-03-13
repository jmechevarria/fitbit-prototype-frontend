import { Component, OnInit, OnDestroy } from "@angular/core";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AccountTypeService } from "src/app/services/account-type.service";
import { ClientAccountService } from "src/app/services/client-account.service";
import { ClientAccount } from "src/app/models/ClientAccount";
import { AccountType } from "src/app/models/AccountType";
import { ClientAccountFactory } from "src/app/models/ClientAccountFactory";

@Component({
  selector: "app-client-account-form",
  templateUrl: "./client-account-form.component.html",
  styleUrls: ["./client-account-form.component.scss"]
})
export class ClientAccountFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  editForm = false;
  inReview = false;
  serverSideError = false;
  serverSideErrorMessage = "";
  BIRTHDATE_MAX: moment.Moment = moment().subtract(60, "y");
  formHeader;
  accountTypes: AccountType[] = [];

  clientAccount: any = new ClientAccount();

  constructor(
    private clientAccountService: ClientAccountService,
    private translate: TranslateService,
    private router: Router,
    private accountTypesService: AccountTypeService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.editForm = this.activatedRoute.snapshot.url[1].toString() === "edit";

    const sub = this.activatedRoute.paramMap.subscribe((params: Params) => {
      if (!this.editForm) {
        this.clientAccount = ClientAccountFactory.createClientAccount(
          parseInt(this.activatedRoute.snapshot.url[2].toString())
        );

        const sub = this.translate
          .get("shared.new_client_account")
          .subscribe(translated => {
            this.formHeader = translated;
          });

        this.subscriptions.push(sub);
      } else {
        const sub = this.translate
          .get("forms.client_account.edit_client_account")
          .subscribe(translated => {
            this.formHeader = translated;
          });
        this.subscriptions.push(sub);

        //get fitbit account
        const sub2 = this.clientAccountService
          .getByID(params.params.id, params.params.type_id)
          .subscribe(response => {
            this.clientAccount = ClientAccountFactory.createClientAccount(
              parseInt(this.activatedRoute.snapshot.url[2].toString()),
              response
            );
          });
        this.subscriptions.push(sub2);
      }
    });

    const sub2 = this.accountTypesService.get().subscribe(response => {
      this.accountTypes = response;
    });

    this.subscriptions.push(sub, sub2);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  // @ViewChild("clientAccountForm", { static: true })
  // public clientAccountForm: NgForm;

  public showFrm(): void {
    // console.log(this.clientAccountForm.controls.email);
  }

  onSubmit() {
    let sub;
    if (!this.editForm)
      sub = this.clientAccountService.create(this.clientAccount).subscribe(
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
                field_value: `'${this.clientAccount[error.entity]}'`
              }
            )}`;
          }
        }
      );
    else {
      sub = this.clientAccountService.patch(this.clientAccount).subscribe(
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
                field_value: `'${this.clientAccount[error.entity]}'`
              }
            )}`;
          }
        }
      );
    }

    this.subscriptions.push(sub);
  }
}
