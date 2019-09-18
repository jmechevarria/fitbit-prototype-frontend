import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FitbitAccountService } from "src/app/services/fitbit-account.service";
import { first } from "rxjs/operators";

@Component({
  selector: "fitbit-accounts-panel",
  templateUrl: "./fitbit-accounts-panel.component.html",
  styleUrls: ["../admin.component.scss", "./fitbit-accounts-panel.component.scss"]
})
export class FitbitAccountsPanelComponent implements OnInit {
  private _fitbitAccounts: [] = [];

  constructor(private fitbitAccountService: FitbitAccountService) {}

  ngOnInit() {}

  @Input()
  set fitbitAccounts(value) {
    this._fitbitAccounts = value;
  }

  get fitbitAccounts() {
    return this._fitbitAccounts;
  }

  @Output() deleteFitbitAccount_EE = new EventEmitter();

  deleteFitbitAccount(id: number) {
    this.deleteFitbitAccount_EE.next(id);
  }
}
