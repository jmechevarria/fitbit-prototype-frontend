import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitDataComponent } from "../fitbit-data/fitbit-data.component";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  currentUser;
  otherFitbitAccounts;

  @ViewChild(FitbitDataComponent, { static: false }) fitbitDataComponent: FitbitDataComponent;

  constructor(
    // private fitbitService: FitbitService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;
    // this.otherFitbitAccounts = this.authenticationService.otherFitbitAccounts;
  }

  getHeartRateData(fitbitAccount) {
    this.fitbitDataComponent.getHeartRateInterday(fitbitAccount);
  }
}
