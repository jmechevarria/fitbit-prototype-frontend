import { Component, OnInit, ViewChild } from "@angular/core";
import { FitbitService } from "../../services/fitbit.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/services/alert.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitDataComponent } from "../fitbit-data/fitbit-data.component";
import { DatePipe } from "@angular/common";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  currentUser;
  otherFitbitAccounts;

  @ViewChild(FitbitDataComponent, { static: false }) fitbitDataComponent: FitbitDataComponent;
  // showFitbitDataComponent = false;

  constructor(
    private fitbitService: FitbitService,
    private alertService: AlertService, //used in template
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;
    this.otherFitbitAccounts = this.authenticationService.otherFitbitAccounts;
  }

  get appHasAccess() {
    return this.fitbitService.appHasAccess();
  }

  getHeartRateData(fitbitAccountID) {
    this.fitbitDataComponent.getHeartRateInterday(fitbitAccountID);
  }

  requestAccess(fitbitAppID: string) {
    if (!fitbitAppID) {
      this.alertService.error("No existe el dispositivo seleccionado");

      alert("devices");
    }
    this.fitbitService.requestAccess(fitbitAppID);
  }

  disconnectFitbit() {
    this.fitbitService.relinquishAccess().subscribe(
      () => {
        this.router.navigate(["/dashboard"]);
      },
      response => {
        console.log(response);
        // if (response.error.errors[0].errorType === "insufficient_permissions") {
        //   this.router.navigate([""]);
        // }
      }
    );
  }
}
