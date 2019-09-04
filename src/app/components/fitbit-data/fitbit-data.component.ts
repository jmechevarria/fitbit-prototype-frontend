import { Component, OnInit } from "@angular/core";
import { FitbitService } from "src/app/services/fitbit.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-fitbit-data",
  templateUrl: "./fitbit-data.component.html",
  styleUrls: ["./fitbit-data.component.scss"]
})
export class FitbitDataComponent implements OnInit {
  fitbitUser: any;
  latestHeartRateData: any;
  heartRateTimeSeries: any; //'activities-heart' => array of days

  constructor(private fitbitService: FitbitService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.fitbitService.getUserProfile().subscribe(response => {
      this.fitbitUser = response;
      console.log(this.fitbitUser);
    });
    this.setLastHeartRateTimeSeries();
    // this.setHeartRateTimeSeriesIntraday(new Date());
  }

  /**
   *
   * @param date A Date object
   */
  private setLastHeartRateTimeSeries(date?: Date) {
    if (date === undefined) {
      date = new Date();
    }

    this.fitbitService.getHeartRateTimeSeries(this.datePipe.transform(date, "yyyy-MM-dd"), "1m").subscribe(response => {
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
        this.setLastHeartRateTimeSeries(date);
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
}
