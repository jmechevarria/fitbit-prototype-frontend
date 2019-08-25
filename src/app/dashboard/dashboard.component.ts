import { Component, OnInit } from "@angular/core";
import { FitbitDataService } from "../services/fitbit-data.service";
import { Router } from "@angular/router";
import { HtmlService } from "../services/html.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  user: any;
  heartRateTimeSeries: any; //'activities-heart' => array of days
  timeSpans: any = [
    { "1d": "1 day" },
    { "7d": "7 days" },
    { "30d": "30 days" },
    { "1w": "1 week" },
    { "1m": "1 month" }
  ];
  // heartRateData: any; //'activities-heart' => array of days

  constructor(
    private fitbitDataService: FitbitDataService,
    private router: Router,
    private htmlService: HtmlService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    if (this.isAuthenticated) {
      this.fitbitDataService.getUserProfile().subscribe(response => {
        this.user = response;
        console.log(this.user);
      });

      this.getLastHeartRateTimeSeries();
      // this.getHeartRateTimeSeries("2019-08-20", "2019-08-24");
    } else this.router.navigate([""]);
  }

  getHeartRateTimeSeries(from: string, to: string) {
    return this.fitbitDataService
      .getHeartRateTimeSeries(from, to)
      .subscribe(response => {
        this.heartRateTimeSeries = response["activities-heart"];
        console.log(this.heartRateTimeSeries);

        // this.heartRateTimeSeries.forEach(day => {
        //   this.heartRateData.push({
        //     dateTime: day.dateTime,
        //     value: day.value
        //   });
        // });
      });
  }

  private getLastHeartRateTimeSeries(date?: Date) {
    const today = new Date();
    // console.log(
    //   this.datePipe.transform(today.setDate(today.getDate() - 3), "yyyy-MM-dd"),
    //   this.datePipe.transform(today, "yyyy-MM-dd")
    // );
    // console.log(today);
    // today.setDate(today.getDate() - 3);
    // console.log(today);
    // this.getHeartRateTimeSeries(
    //   this.datePipe.transform(today.setDate(today.getDate() - 1), "yyyy-MM-dd"),
    //   this.datePipe.transform(today, "yyyy-MM-dd")
    // );
    this.getHeartRateTimeSeries(
      this.datePipe.transform(today, "yyyy-MM-dd"),
      this.datePipe.transform(today, "yyyy-MM-dd")
    );

    today.setDate(today.getDate() - 1);
  }

  get isAuthenticated() {
    return this.fitbitDataService.isAuthenticated();
  }

  logout() {
    this.fitbitDataService.logout().subscribe(() => {
      https: this.fitbitDataService.clearAccessToken();
      this.router.navigate([""]);
    });
  }

  timeSpanChanged() {
    this.getHeartRateTimeSeries("2018-08-23", "2019-08-24");
  }
}
