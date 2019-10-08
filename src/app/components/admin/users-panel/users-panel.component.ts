import { Component, OnInit, Input, Output, EventEmitter, Inject } from "@angular/core";
import { DialogService } from "src/app/services/dialog.service";
import { SelectionListDialogComponent } from "src/app/widgets/components/selection-list-dialog/selection-list-dialog.component";
import { ConfirmationDialogComponent } from "src/app/widgets/components/confirmation-dialog/confirmation-dialog.component";

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
  private _users;

  constructor(private dialogService: DialogService) {}

  ngOnInit() {}

  @Input()
  set users(value) {
    this._users = value;
  }

  get users() {
    return this._users;
  }

  @Input()
  fitbitAccounts;

  @Output() deleteUser_EE = new EventEmitter();

  deleteUser(id: number) {
    const dialogRef = this.dialogService.customDialogComponent(ConfirmationDialogComponent, {
      data: {
        title: "Delete user",
        body: `<p class='mat-h4'>User <b>${this._users[id].fullname}</b> will be deleted from the system.</p>
        <p class='mat-body-strong' style="font-style: italic; color: red">This action is irreversible.</p>`
      }
    });

    dialogRef.afterClosed().subscribe(reply => {
      if (reply) {
        this.deleteUser_EE.next(id);
      }
    });
  }

  @Output() unlinkFromFitbitAccount_EE = new EventEmitter();

  unlinkFromFitbitAccount(userID, fitbitAccountID) {
    const dialogRef = this.dialogService.customDialogComponent(ConfirmationDialogComponent, {
      data: {
        title: "Unlink caregiver from Fitbit account",
        body: `<p class='mat-h4'>Caregiver <b>${this._users[userID].fullname}</b> will no longer be able to monitor fitbit account
        <b>${this.fitbitAccounts[fitbitAccountID].fullname}</b> (ID: ${fitbitAccountID})</p>`
      }
    });

    dialogRef.afterClosed().subscribe(reply => {
      if (reply) {
        this.unlinkFromFitbitAccount_EE.next({ userID, fitbitAccountID });
      }
    });
  }

  @Output() linkToFitbitAccount_EE = new EventEmitter();

  linkToFitbitAccount(user) {
    const fitbitAccounts = Object.keys(this.fitbitAccounts).reduce((acc, key) => {
      acc[key] = { ...this.fitbitAccounts[key], show: !user.fitbitAccounts[key] && true };
      return acc;
    }, {});

    const dialogRef = this.dialogService.customDialogComponent(SelectionListDialogComponent, {
      data: { fitbitAccounts: fitbitAccounts, selected: [] }
    });

    dialogRef.afterClosed().subscribe(selected => {
      console.log(selected);
      if (!!selected && !!selected.length) {
        const selectedFAIDs = selected.map(element => element.key);

        this.linkToFitbitAccount_EE.emit({ userID: user.id, selectedFAIDs });
      }
    });
  }

  @Output() refreshAccessToken_EE = new EventEmitter();

  refreshAccessToken(fitbitAppID) {
    if (!!fitbitAppID) this.refreshAccessToken_EE.emit(fitbitAppID);
  }

  @Output() revokeAccessToken_EE = new EventEmitter();

  revokeAccessToken(fitbitAppID) {
    if (!!fitbitAppID) this.revokeAccessToken_EE.emit(fitbitAppID);
  }
}
