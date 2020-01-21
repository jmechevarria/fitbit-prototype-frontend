import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DialogService } from "src/app/services/dialog.service";
import { ConfirmationDialogComponent } from "src/app/widgets/components/confirmation-dialog/confirmation-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { switchMap, filter, tap } from "rxjs/operators";

@Component({
  selector: "fitbit-accounts-panel",
  templateUrl: "./fitbit-accounts-panel.component.html",
  styleUrls: [
    "../admin.component.scss",
    "./fitbit-accounts-panel.component.scss"
  ]
})
export class FitbitAccountsPanelComponent implements OnInit {
  private _fitbitAccounts: [] = [];

  constructor(
    private dialogService: DialogService,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  @Input()
  set fitbitAccounts(value) {
    this._fitbitAccounts = value;
  }

  get fitbitAccounts(): any {
    return this._fitbitAccounts;
  }

  @Output() refreshAccessToken_EE = new EventEmitter();

  refreshAccessToken(fitbitAccountID) {
    if (fitbitAccountID) this.refreshAccessToken_EE.emit(fitbitAccountID);
  }

  @Output() revokeAccessToken_EE = new EventEmitter();

  revokeAccessToken(fitbitAccountID) {
    if (fitbitAccountID) this.revokeAccessToken_EE.emit(fitbitAccountID);
  }

  @Output() deleteFitbitAccount_EE = new EventEmitter();

  deleteFitbitAccount(id: number) {
    const title$ = this.translate.get(
      "admin.fitbit_accounts_panel.dialog.delete_fitbit_account"
    );
    const body$ = this.translate.get(
      "admin.fitbit_accounts_panel.dialog.delete_fitbit_account_body_msg",
      {
        name: `<b>${this.fitbitAccounts[id].fullname}</b>`
      }
    );
    const warning$ = this.translate.get("shared.warning");

    forkJoin([title$, body$, warning$])
      .pipe(
        switchMap(([title, body, warning]) => {
          let bodyText = `<p class='mat-h4'>${body}
          </p><p class='mat-body-strong' color='warn' style="font-style: italic; color: red">${warning}</p>`;

          const dialogRef = this.dialogService.customDialogComponent(
            ConfirmationDialogComponent,
            {
              data: {
                title,
                body: bodyText
              }
            }
          );

          return dialogRef.afterClosed();
        }),
        filter(reply => reply),
        tap(() => {
          this.deleteFitbitAccount_EE.next(id);
        })
      )
      .subscribe();
  }
}
