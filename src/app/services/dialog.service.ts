import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";

// import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";

@Injectable({
  providedIn: "root"
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  defaultDialogConfig = {
    width: "50%",
    data: {
      closeText: "Close"
    }
  };

  //   confirm(message: string) {
  //     let confirmDialogConfig: MatDialogConfig = {
  //       width: "250px",
  //       disableClose: true,
  //       data: { message }
  //     };

  //     return this.openDialog(ConfirmDialogComponent, confirmDialogConfig).afterClosed();
  //   }

  customDialogComponent<T>(
    component: T,
    config: MatDialogConfig = this.defaultDialogConfig
  ) {
    config.data = { ...this.defaultDialogConfig.data, ...config.data };
    return this.openDialog(component, {
      ...this.defaultDialogConfig,
      ...config
    });
  }

  private openDialog(component, config: MatDialogConfig) {
    return this.dialog.open(component, config);
  }
}
