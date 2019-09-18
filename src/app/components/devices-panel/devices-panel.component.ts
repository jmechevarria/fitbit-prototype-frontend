import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "devices-panel",
  templateUrl: "./devices-panel.component.html",
  styleUrls: ["./devices-panel.component.scss"]
})
export class DevicesPanelComponent implements OnInit {
  _fitbitAccounts;
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  @Input()
  set fitbitAccounts(fitbitAccounts) {
    this._fitbitAccounts = fitbitAccounts;
  }

  get fitbitAccounts() {
    return this._fitbitAccounts;
  }

  @Output() showHeartRateData_EE = new EventEmitter();

  // callParent() {
  //   this.someEvent.next("somePhone");
  // }

  getHeartRateData(fitbitAccountID) {
    this.showHeartRateData_EE.next(fitbitAccountID);
  }
}
