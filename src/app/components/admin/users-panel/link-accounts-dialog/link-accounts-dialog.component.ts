import { Component, OnInit } from "@angular/core";
import { MDBModalRef } from "angular-bootstrap-md";
import { Subject } from "rxjs";

@Component({
  selector: "link-accounts-dialog",
  templateUrl: "./link-accounts-dialog.component.html",
  styleUrls: ["./link-accounts-dialog.component.scss"]
})
export class LinkAccountsDialogComponent implements OnInit {
  loading: boolean = true;
  title: string;
  content: any = {};
  selected: any[];
  action: Subject<any> = new Subject();

  constructor(public modalRef: MDBModalRef) {}

  ngOnInit() {}

  onProceed() {
    this.action.next(this.selected);
  }
}
