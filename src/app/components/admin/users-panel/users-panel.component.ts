import { Component, OnInit, Input, Output, EventEmitter, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

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

  // animal: string;
  // name: string;
  dialogData: DialogData = {} as DialogData;

  constructor(
    public dialog: MatDialog // private userService: UserService
  ) {}

  ngOnInit() {}

  @Input()
  set users(value) {
    this._users = value;
  }

  get users() {
    return this._users;
  }

  @Input()
  set fitbitAccounts(value) {
    this.dialogData.fitbitAccounts = value;
    console.log(this.dialogData.fitbitAccounts);
  }

  get fitbitAccounts() {
    return this.dialogData.fitbitAccounts;
  }

  @Output() deleteUser_EE = new EventEmitter();

  deleteUser(id: number) {
    this.deleteUser_EE.next(id);
  }

  @Output() unlinkFromFitbitAccount_EE = new EventEmitter();

  unlinkFromFitbitAccount(userID, fitbitAccountID) {
    this.unlinkFromFitbitAccount_EE.next({ userID, fitbitAccountID });
  }

  @Output() linkToFitbitAccount_EE = new EventEmitter();

  linkToFitbitAccount_Dialog(user) {
    let fitbitAccounts = this.dialogData.fitbitAccounts;
    console.log(user);
    console.log(Object.values(this.dialogData.fitbitAccounts));
    Object.keys(fitbitAccounts).forEach(id => {
      fitbitAccounts[id].show = true;
      if (!!user.fitbitAccounts[id]) {
        // delete fitbitAccounts[element];
        console.log(id);
        fitbitAccounts[id].show = false;
      }
    });
    console.log(fitbitAccounts);

    const dialogRef = this.dialog.open(LinkToFitbitAccount_Dialog, {
      width: "50%",
      data: { fitbitAccounts, selected: [] }
      // data: { user, selected: [] }
    });

    dialogRef.afterClosed().subscribe(selected => {
      if (!!selected && !!selected.length) {
        console.log(selected);
        this.dialogData.selected = selected;

        const selectedFAIDs = this.dialogData.selected.map(element => {
          return element.key;
        });
        console.log(selectedFAIDs);

        this.linkToFitbitAccount_EE.next({ userID: user.id, selectedFAIDs });
      }
    });
  }
}

@Component({
  selector: "link-to-fitbit-account-dialog",
  template: `
    <h1 mat-dialog-title>Link caregiver to Fitbit accounts</h1>
    <div mat-dialog-content>
      <mat-selection-list #fitbitAccounts [(ngModel)]="data.selected">
        <ng-container *ngFor="let fa of data.fitbitAccounts | keyvalue">
          <mat-list-option *ngIf="fa.value.show" [value]="fa"> {{ fa.key }}. {{ fa.value.fullname }} </mat-list-option>
        </ng-container>
      </mat-selection-list>

      <p>Accounts selected: {{ fitbitAccounts.selectedOptions.selected.length }}</p>

      <!-- <mat-form-field>
        <input matInput [(ngModel)]="data.animal" />
      </mat-form-field>-->
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">No Thanks</button>
      <button mat-button [mat-dialog-close]="data.selected" cdkFocusInitial>Ok</button>
    </div>
  `
})
export class LinkToFitbitAccount_Dialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<LinkToFitbitAccount_Dialog>, @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    console.log(this.data.user);
    console.log(this.data.fitbitAccounts);
  }

  // @Input()
  // set fitbitAccounts(value) {
  //   console.log(value);
  //   this.data.fitbitAccounts = value.filter(element => {
  //     return this.data.user.fitbitAccounts[element];
  //   });
  // }

  close(): void {
    this.dialogRef.close();
  }
}
