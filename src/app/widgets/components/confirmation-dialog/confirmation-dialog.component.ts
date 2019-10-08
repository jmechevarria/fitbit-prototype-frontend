import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { SelectionListDialogComponent } from "../selection-list-dialog/selection-list-dialog.component";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.scss"]
})
export class ConfirmationDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SelectionListDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    if (!this.data.title) this.data.title = "confirmation_dialog";
    if (!this.data.body) this.data.body = "<p class='mat-h4'>Confirm or cancel the action</p>";
    if (!this.data.confirmText) this.data.confirmText = "Confirmar";
    if (!this.data.cancelText) this.data.cancelText = "cancel";
    // if (!this.data.title) this.data.title = "Confirmation dialog";
    // if (!this.data.body) this.data.body = "<p class='mat-h4'>Confirm or cancel the action</p>";
    // if (!this.data.confirmText) this.data.confirmText = "Confirm";
    // if (!this.data.cancelText) this.data.cancelText = "Cancel";
    console.log(this.data);
  }

  close(): void {
    this.dialogRef.close();
  }
}
