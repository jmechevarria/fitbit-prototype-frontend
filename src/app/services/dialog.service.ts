import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";

// import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";

@Injectable({
  providedIn: "root"
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  defaultDialogConfig = {
    width: "50%"
  };

  //   confirm(message: string) {
  //     let confirmDialogConfig: MatDialogConfig = {
  //       width: "250px",
  //       disableClose: true,
  //       data: { message }
  //     };

  //     return this.openDialog(ConfirmDialogComponent, confirmDialogConfig).afterClosed();
  //   }

  customDialogComponent<T>(component: T, config: MatDialogConfig = this.defaultDialogConfig) {
    const dialogRef = this.openDialog(component, { ...this.defaultDialogConfig, ...config });
    return dialogRef;
  }

  private openDialog(component, config: MatDialogConfig) {
    let dialogRef = this.dialog.open(component, config);

    return dialogRef;
  }
}
