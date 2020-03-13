import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.scss"]
})
export class ConfirmationDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (!this.data.title) this.data.title = "dialog.confirmation_dialog";

    if (!this.data.body) {
      const defaultBody = this.translate.instant("dialog.default_body");
      this.data.body = `<p class='mat-h4'>${defaultBody}</p>`;
    }

    if (!this.data.confirmText) this.data.confirmText = "shared.confirm";
    if (!this.data.cancelText) this.data.cancelText = "shared.cancel";
  }

  close(): void {
    this.dialogRef.close();
  }
}
