import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DialogService } from "src/app/services/dialog.service";
import { ConfirmationDialogComponent } from "src/app/widgets/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "fitbit-accounts-panel",
  templateUrl: "./fitbit-accounts-panel.component.html",
  styleUrls: ["../admin.component.scss", "./fitbit-accounts-panel.component.scss"]
})
export class FitbitAccountsPanelComponent implements OnInit {
  private _fitbitAccounts: [] = [];

  constructor(private dialogService: DialogService) {}

  ngOnInit() {}

  @Input()
  set fitbitAccounts(value) {
    this._fitbitAccounts = value;
  }

  get fitbitAccounts(): any {
    return this._fitbitAccounts;
  }

  @Output() deleteFitbitAccount_EE = new EventEmitter();

  deleteFitbitAccount(id: number) {
    const dialogRef = this.dialogService.customDialogComponent(ConfirmationDialogComponent, {
      data: {
        title: "Delete fitbit account",
        body: `<p class='mat-h4'>Fitbit account <b>${this.fitbitAccounts[id].fullname}</b> will be deleted from the system.</p>
        <p class='mat-body-strong' color='warn' style="font-style: italic; color: red">This action is irreversible.</p>`
      }
    });

    dialogRef.afterClosed().subscribe(reply => {
      if (reply) {
        this.deleteFitbitAccount_EE.next(id);
      }
    });
  }
}
