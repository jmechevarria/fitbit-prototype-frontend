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

  @ViewChild(FitbitDataComponent, { static: false })
  fitbitDataComponent: FitbitDataComponent;

  constructor(
    // private fitbitService: FitbitService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;
  }

  getHeartRateData(fitbitAccount) {
    this.fitbitDataComponent.getHeartRateInterday(fitbitAccount);
  }
}
