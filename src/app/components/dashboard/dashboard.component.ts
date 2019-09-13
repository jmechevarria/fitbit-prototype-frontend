import { Component, OnInit } from "@angular/core";
import { FitbitService } from "../../services/fitbit.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/services/alert.service";
import { FitbitApp } from "src/app/models/FitbitApp";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  //at this moment the variable 'fitbitAPIApplicationID' corresponds to ONE fitbit account
  //hence, it corresponds to ONE fitbit device
  // fitbitAPIApplicationID: string;

  // heartRateTimeSeries: any; //'activities-heart' => array of days
  // latestHeartRateData: any;

  // timeSpans: any = [
  //   { "1d": "1 day" },
  //   { "7d": "7 days" },
  //   { "30d": "30 days" },
  //   { "1w": "1 week" },
  //   { "1m": "1 month" }
  // ];

  // selectedTimeSpan: any = "30d";
  // selectedRangeFrom: any = "";
  // selectedRangeTo: any;
  // selectedRangeMin: any = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 10);
  // selectedRangeMax: any = new Date();
  // // filterTypes: [string, string] = ["time-span", "range"];
  // filterType: any = "time-span";

  // heartRateData: any; //'activities-heart' => array of days

  constructor(
    private fitbitService: FitbitService,
    private alertService: AlertService, //used in template
    private router: Router
  ) {}

  ngOnInit() {
    // if (this.isAuthenticated) {
    // this.fitbitDataService.getUserProfile().subscribe(response => {
    //   this.user = response;
    //   console.log(this.user);
    // });
    // this.setLastHeartRateTimeSeries();
    // this.setHeartRateTimeSeriesIntraday(new Date());
    // this.getHeartRateTimeSeries("2019-08-20", "2019-08-24");
    // }
    // else this.router.navigate([""]);
  }

  get fitbitAccounts(): [] {
    return JSON.parse(localStorage.getItem("fitbit-accounts"));
  }

  get fitbitApps(): Array<FitbitApp> {
    const aux: [] = this.fitbitService.fitbitApps;

    aux.forEach(fitbitApp => {
      const fitbitAccount = this.fitbitAccounts.find(fitbitAccount => {
        return fitbitAccount["id"] === fitbitApp["fitbitAccountID"];
      });
      fitbitApp["fitbitAccount"] = fitbitAccount;
    });
    console.log(aux);
    return aux;
  }

  // get devicesAsArray() {
  //   return JSON.parse(localStorage.getItem("devices")).asArray;
  // }

  // selectDevice(id: number) {
  //   console.log(id);
  //   this.requestAccess(id);
  // }

  // setHeartRateTimeSeriesIntraday(date: Date) {
  //   this.fitbitService
  //     .getHeartRateIntraday(this.datePipe.transform(date, "yyyy-MM-dd"), this.datePipe.transform(date, "yyyy-MM-dd"))
  //     .subscribe(response => {
  //       console.log(response);
  //     });
  // }

  // getHeartRateTimeSeries(from: string, to: string) {
  //   return this.fitbitService.getHeartRateTimeSeries(from, to).subscribe(response => {
  //     this.heartRateTimeSeries = response["activities-heart"];
  //     console.log(this.heartRateTimeSeries);
  //   });
  // }

  /**
   *
   * @param date A Date object
   */
  // private setLastHeartRateTimeSeries(date?: Date) {
  //   if (date === undefined) {
  //     date = new Date();
  //   }

  //   this.fitbitService.getHeartRateTimeSeries(this.datePipe.transform(date, "yyyy-MM-dd"), "1m").subscribe(response => {
  //     this.latestHeartRateData = undefined;
  //     this.heartRateTimeSeries = response["activities-heart"];
  //     console.log(this.heartRateTimeSeries);
  //     this.heartRateTimeSeries.reverse().some(day => {
  //       console.log(day);
  //       let found = false;
  //       console.log(found);
  //       day.value.heartRateZones.some(heartRateZone => {
  //         if (heartRateZone.minutes !== undefined) {
  //           this.latestHeartRateData = day;
  //           console.log(heartRateZone);
  //           found = true;
  //           return true;
  //         }
  //       });
  //       return found;
  //     });

  //     console.log(this.latestHeartRateData);

  //     if (this.latestHeartRateData === undefined) {
  //       date.setDate(date.getDate() - 1);
  //       this.setLastHeartRateTimeSeries(date);
  //     }

  //     // if (
  //     //   !this.heartRateTimeSeries[0].value.heartRateZones.some(element => {
  //     //     return element.minutes !== undefined;
  //     //   }) &&
  //     //   Date.now() - date.getTime() < 1000 * 60 * 60 * 24 * 365 //~milliseconds in a year
  //     // ) {
  //     //   //if no records were found for 'date', we look in the day before,
  //     //   //recursively until some records are found or this shit blows up
  //     //   date.setDate(date.getDate() - 1);
  //     //   this.getLastHeartRateTimeSeries(date);
  //     // }
  //   });
  // }

  get appHasAccess() {
    return this.fitbitService.appHasAccess();
  }

  requestAccess(fitbitAppID: string) {
    // console.log(fitbitAppID);
    // const fitbitApp = this.fitbitApps.find(fitbitApp => {
    //   return fitbitApp.id === fitbitAppID;
    // });
    // console.log(fitbitApp);

    // const fitbitAccount = this.fitbitAccounts.find(fitbitAccount => {
    //   return (fitbitAccount.fitbitApp.id = fitbitApp.id);
    // });
    // console.log(fitbitAccount);

    // device.fitbitAccount = {

    // };
    if (!fitbitAppID) {
      this.alertService.error("No existe el dispositivo seleccionado");
      // console.log(this.fitbitApps);
      alert("devices");
    }
    this.fitbitService.requestAccess(fitbitAppID);
  }

  disconnectFitbit() {
    // https: this.fitbitDataService.clearAccessToken();
    this.fitbitService.relinquishAccess().subscribe(
      () => {
        //on success
        // this.fitbitDataService.clearAccessToken();
        this.router.navigate(["/dashboard"]);
      },
      response => {
        // //on error
        console.log(response);
        // if (response.error.errors[0].errorType === "insufficient_permissions") {
        //   this.router.navigate([""]);
        // }
      }
    );
  }

  // timeSpanChanged() {
  //   this.getHeartRateTimeSeries("2018-08-23", "2019-08-24");
  // }

  // filterTypeChanged(event: MatRadioChange) {
  //   this.filterType = event.value;
  // }

  // applyFilter() {}
}
