import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { DialogService } from "src/app/services/dialog.service";
import { ConfirmationDialogComponent } from "src/app/widgets/components/confirmation-dialog/confirmation-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, Subscription } from "rxjs";
import { switchMap, filter, tap } from "rxjs/operators";

@Component({
  selector: "fitbit-accounts-panel",
  templateUrl: "./fitbit-accounts-panel.component.html",
  styleUrls: [
    "../admin.component.scss",
    "./fitbit-accounts-panel.component.scss"
  ]
})
export class FitbitAccountsPanelComponent implements OnInit, OnDestroy {
  private _fitbitAccounts: [] = [];
  @Input()
  set fitbitAccounts(value) {
    this._fitbitAccounts = value;
  }

  get fitbitAccounts(): any {
    return this._fitbitAccounts;
  }

  @Output() refreshAccessToken_EE = new EventEmitter();
  @Output() revokeAccessToken_EE = new EventEmitter();
  @Output() deleteFitbitAccount_EE = new EventEmitter();

  private subscriptions: Subscription[];

  constructor(
    private dialogService: DialogService,
    private translate: TranslateService
  ) {}

  ngOnInit() {}
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  refreshAccessToken(fitbitAccountID) {
    if (fitbitAccountID) this.refreshAccessToken_EE.emit(fitbitAccountID);
  }

  revokeAccessToken(fitbitAccountID) {
    if (fitbitAccountID) this.revokeAccessToken_EE.emit(fitbitAccountID);
  }

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

    this.subscriptions.push(sub);
  }
}
