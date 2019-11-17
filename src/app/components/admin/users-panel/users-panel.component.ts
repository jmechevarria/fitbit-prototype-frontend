import { Component, OnInit, Input, Output, EventEmitter, Inject } from "@angular/core";
import { DialogService } from "src/app/services/dialog.service";
import { SelectionListDialogComponent } from "src/app/widgets/components/selection-list-dialog/selection-list-dialog.component";
import { ConfirmationDialogComponent } from "src/app/widgets/components/confirmation-dialog/confirmation-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { switchMap, tap, filter } from "rxjs/operators";

export interface DialogData {
  fitbitAccounts: {};
  selected: Array<any>;
}

@Component({
  selector: "users-panel",
  templateUrl: "./users-panel.component.html",
  styleUrls: ["../admin.component.scss", "./users-panel.component.scss"]
})
export class UsersPanelComponent implements OnInit {
  @Input()
  users;

  @Input()
  fitbitAccounts;

  @Output() deleteUser_EE = new EventEmitter();
  @Output() unlinkFromFitbitAccount_EE = new EventEmitter();
  @Output() linkToFitbitAccount_EE = new EventEmitter();

  constructor(private dialogService: DialogService, private translate: TranslateService) {}

  ngOnInit() {}

  deleteUser(id: number) {
    const title$ = this.translate.get("admin.users_panel.dialog.delete_user");
    const body$ = this.translate.get("admin.users_panel.dialog.delete_user_body_msg", {
      name: `<b>${this.users[id].fullname}</b>`
    });
    const warning$ = this.translate.get("shared.warning");

    forkJoin([title$, body$, warning$])
      .pipe(
        switchMap(([title, body, warning]) => {
          const bodyText = `<p class='mat-h4'>${body}
          </p><p class='mat-body-strong' color='warn' style="font-style: italic; color: red">${warning}</p>`;

          const dialogRef = this.dialogService.customDialogComponent(ConfirmationDialogComponent, {
            data: {
              title,
              body: bodyText
            }
          });

          return dialogRef.afterClosed();
        }),
        filter(reply => reply),
        tap(() => {
          this.deleteUser_EE.next(id);
        })
      )
      .subscribe();
  }

  unlinkFromFitbitAccount(userID, fitbitAccountID) {
    const title$ = this.translate.get("admin.users_panel.dialog.unlink_caregiver_from_fitbit_account");
    const body$ = this.translate.get("admin.users_panel.dialog.unlink_caregiver_from_fitbit_account_body", {
      userFullname: `<b>${this.users[userID].fullname}</b>`,
      fitbitAccountFullname: `<b>${this.fitbitAccounts[fitbitAccountID].fullname}</b>`,
      fitbitAccountID: fitbitAccountID
    });

    forkJoin([title$, body$])
      .pipe(
        switchMap(([title, body]) => {
          const bodyText = `<p class='mat-h4'>${body}</p>`;

          const dialogRef = this.dialogService.customDialogComponent(ConfirmationDialogComponent, {
            data: {
              title,
              body: bodyText
            }
          });

          return dialogRef.afterClosed();
        }),
        filter(reply => reply),
        tap(() => {
          this.unlinkFromFitbitAccount_EE.next({ userID, fitbitAccountID });
        })
      )
      .subscribe();
  }

  linkToFitbitAccount(user) {
    const fitbitAccounts = Object.keys(this.fitbitAccounts).reduce((acc, key) => {
      acc[key] = { ...this.fitbitAccounts[key], show: !user.fitbitAccounts[key] && true };
      return acc;
    }, {});

    const dialogRef = this.dialogService.customDialogComponent(SelectionListDialogComponent, {
      data: { fitbitAccounts: fitbitAccounts, selected: [] }
    });

    dialogRef.afterClosed().subscribe(selected => {
      if (!!selected && !!selected.length) {
        const selectedFAIDs = selected.map(element => element.key);

        this.linkToFitbitAccount_EE.emit({ userID: user.id, selectedFAIDs });
      }
    });
  }

  // @Output() refreshAccessToken_EE = new EventEmitter();

  // refreshAccessToken(fitbitAccountID) {
  //   if (!!fitbitAccountID) this.refreshAccessToken_EE.emit(fitbitAccountID);
  // }

  // @Output() revokeAccessToken_EE = new EventEmitter();

  // revokeAccessToken(fitbitAccountID) {
  //   if (!!fitbitAccountID) this.revokeAccessToken_EE.emit(fitbitAccountID);
  // }
}
