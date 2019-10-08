import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-selection-list-dialog",
  templateUrl: "./selection-list-dialog.component.html",
  styleUrls: ["./selection-list-dialog.component.scss"]
})
export class SelectionListDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SelectionListDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {}

  close(): void {
    this.dialogRef.close();
  }
}
