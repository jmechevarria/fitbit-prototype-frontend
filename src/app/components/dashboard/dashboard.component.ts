import { Component, OnInit, EventEmitter } from "@angular/core";
import { FitbitDataService } from "../../services/fitbit-data.service";
import { Router } from "@angular/router";
import { HtmlService } from "../../services/html.service";
import { DatePipe } from "@angular/common";
import { MatRadioChange } from "@angular/material/radio";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  user: any;
  heartRateTimeSeries: any; //'activities-heart' => array of days
  latestHeartRateData: any;

  timeSpans: any = [{ "1d": "1 day" }, { "7d": "7 days" }, { "30d": "30 days" }, { "1w": "1 week" }, { "1m": "1 month" }];

  selectedTimeSpan: any = "30d";
  selectedRangeFrom: any = "";
  selectedRangeTo: any;
  selectedRangeMin: any = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 10);
  selectedRangeMax: any = new Date();
  // filterTypes: [string, string] = ["time-span", "range"];
  filterType: any = "time-span";

  // heartRateData: any; //'activities-heart' => array of days

  constructor(private fitbitDataService: FitbitDataService, private router: Router, private htmlService: HtmlService, private datePipe: DatePipe) {}

  ngOnInit() {
    if (this.isAuthenticated) {
      this.fitbitDataService.getUserProfile().subscribe(response => {
        this.user = response;
        console.log(this.user);
      });

      this.getLastHeartRateTimeSeries();
      this.getHeartRateTimeSeriesIntraday(new Date());

      // this.getHeartRateTimeSeries("2019-08-20", "2019-08-24");
    } else this.router.navigate([""]);
  }
  getHeartRateTimeSeriesIntraday(date: Date) {
    this.fitbitDataService
      .getHeartRateIntraday(this.datePipe.transform(date, "yyyy-MM-dd"), this.datePipe.transform(date, "yyyy-MM-dd"))
      .subscribe(response => {
        console.log(response);
      });
  }

  getHeartRateTimeSeries(from: string, to: string) {
    return this.fitbitDataService.getHeartRateTimeSeries(from, to).subscribe(response => {
      this.heartRateTimeSeries = response["activities-heart"];
      console.log(this.heartRateTimeSeries);
    });
  }

  /**
   *
   * @param date A Date object
   */
  private getLastHeartRateTimeSeries(date?: Date) {
    if (date === undefined) {
      date = new Date();
    }

    this.fitbitDataService.getHeartRateTimeSeries(this.datePipe.transform(date, "yyyy-MM-dd"), "1m").subscribe(response => {
      this.latestHeartRateData = undefined;
      this.heartRateTimeSeries = response["activities-heart"];
      console.log(this.heartRateTimeSeries);
      this.heartRateTimeSeries.reverse().some(day => {
        console.log(day);
        let found = false;
        console.log(found);
        day.value.heartRateZones.some(heartRateZone => {
          if (heartRateZone.minutes !== undefined) {
            this.latestHeartRateData = day;
            console.log(heartRateZone);
            found = true;
            return true;
          }
        });
        return found;
      });

      console.log(this.latestHeartRateData);

      if (this.latestHeartRateData === undefined) {
        date.setDate(date.getDate() - 1);
        this.getLastHeartRateTimeSeries(date);
      }

      // if (
      //   !this.heartRateTimeSeries[0].value.heartRateZones.some(element => {
      //     return element.minutes !== undefined;
      //   }) &&
      //   Date.now() - date.getTime() < 1000 * 60 * 60 * 24 * 365 //~milliseconds in a year
      // ) {
      //   //if no records were found for 'date', we look in the day before,
      //   //recursively until some records are found or this shit blows up
      //   date.setDate(date.getDate() - 1);
      //   this.getLastHeartRateTimeSeries(date);
      // }
    });
  }

  get isAuthenticated() {
    return this.fitbitDataService.isAuthenticated();
  }

  logout() {
    // https: this.fitbitDataService.clearAccessToken();
    this.fitbitDataService.logout().subscribe(
      () => {
        //on success
        https: this.fitbitDataService.clearAccessToken();
        this.router.navigate([""]);
      },
      response => {
        //on error
        if (response.error.errors[0].errorType === "insufficient_permissions") {
          https: this.fitbitDataService.clearAccessToken();
          this.router.navigate([""]);
        }
      }
    );
  }

  timeSpanChanged() {
    this.getHeartRateTimeSeries("2018-08-23", "2019-08-24");
  }

  filterTypeChanged(event: MatRadioChange) {
    this.filterType = event.value;
  }

  applyFilter() {}
}
