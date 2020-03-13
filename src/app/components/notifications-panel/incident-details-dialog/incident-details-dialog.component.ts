import { Component, OnInit } from "@angular/core";
import { MDBModalRef } from "angular-bootstrap-md";
import { Subject } from "rxjs";

@Component({
  selector: "incident-details-dialog",
  templateUrl: "./incident-details-dialog.component.html",
  styleUrls: ["./incident-details-dialog.component.scss"]
})
export class IncidentDetailsDialogComponent implements OnInit {
  loading: boolean = true;
  title: string;
  content: any = {};
  header: any[];

  action: Subject<any> = new Subject();

  constructor(public modalRef: MDBModalRef) {}

  ngOnInit() {}

  onClose() {
    this.action.next("yes");
  }
}
