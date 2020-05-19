import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { DialogService } from "src/app/services/dialog.service";
import { ConfirmationDialogComponent } from "src/app/widgets/components/confirmation-dialog/confirmation-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, Subscription } from "rxjs";
import { switchMap, filter, tap } from "rxjs/operators";
import { AccountTypeService } from "src/app/services/account-type.service";

@Component({
  selector: "client-accounts-panel",
  templateUrl: "./client-accounts-panel.component.html",
  styleUrls: ["./client-accounts-panel.component.scss"],
})
export class ClientAccountsPanelComponent implements OnInit, OnDestroy {
  @Input()
  clientAccounts;

  accountTypes;

  @Output() refreshAccessToken_EE = new EventEmitter();
  @Output() revokeAccessToken_EE = new EventEmitter();
  @Output() deleteFitbitAccount_EE = new EventEmitter();

  private subscriptions: Subscription[] = [];

  constructor(
    private dialogService: DialogService,
    private translate: TranslateService,
    private accountTypeService: AccountTypeService
  ) {}

  ngOnInit() {
    const sub = this.accountTypeService.get().subscribe((response) => {
      this.accountTypes = response;
      console.log(this.accountTypes);
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  refreshAccessToken(fitbitAccount) {
    if (fitbitAccount) this.refreshAccessToken_EE.emit(fitbitAccount);
  }

  revokeAccessToken(fitbitAccount) {
    if (fitbitAccount) this.revokeAccessToken_EE.emit(fitbitAccount);
  }

  deleteClientAccount(id: number) {
    const title$ = this.translate.get(
      "admin.client_accounts_panel.dialog.delete_client_account"
    );
    const body$ = this.translate.get(
      "admin.client_accounts_panel.dialog.delete_client_account_body_msg",
      {
        name: `<b>${
          this.clientAccounts[id].firstname +
          " " +
          this.clientAccounts[id].lastname +
          " " +
          (this.clientAccounts[id].lastname2
            ? this.clientAccounts[id].lastname2
            : "")
        }</b>`,
      }
    );
    const warning$ = this.translate.get("admin.users_panel.dialog.warning");

    const sub = forkJoin([title$, body$, warning$])
      .pipe(
        switchMap(([title, body, warning]) => {
          let bodyText = `<p class='mat-h4'>${body}
          </p><p class='mat-body-strong' color='warn' style="font-style: italic; color: red">${warning}</p>`;

          const dialogRef = this.dialogService.customDialogComponent(
            ConfirmationDialogComponent,
            {
              data: {
                title,
                body: bodyText,
              },
            }
          );

          return dialogRef.afterClosed();
        }),
        filter((reply) => reply),
        tap(() => {
          this.deleteFitbitAccount_EE.next(id);
        })
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
