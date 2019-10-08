import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "devices-panel",
  templateUrl: "./devices-panel.component.html",
  styleUrls: ["./devices-panel.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DevicesPanelComponent implements OnInit {
  _fitbitAccounts;
  constructor() {}

  ngOnInit() {}

  age(birthdate) {
    if (!!birthdate) {
      return moment().diff(birthdate, "years");
    }
  }

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

  getHeartRateData(fitbitAccount) {
    console.log(fitbitAccount);
    this.showHeartRateData_EE.next(fitbitAccount);
  }
}
