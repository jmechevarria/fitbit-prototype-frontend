import { Component, OnInit, ViewChild } from "@angular/core";
import { FitbitService } from "src/app/services/fitbit.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";

export interface interdayHeartRateDataSource {
  date: string;
  "Out of Range": { caloriesOut: string; minutes: string };
  "Fat Burn": { caloriesOut: string; minutes: string };
  Cardio: { caloriesOut: string; minutes: string };
  Peak: { caloriesOut: string; minutes: string };
}

@Component({
  selector: "fitbit-data",
  templateUrl: "./fitbit-data.component.html",
  styleUrls: ["./fitbit-data.component.scss"]
})
export class FitbitDataComponent implements OnInit {
  fitbitUser: any;

  test: boolean = false;

  //DATE RANGE
  PREDEFINED_RANGE: string = "predefined-range";
  SPECIFIC_RANGE: string = "specific-range";
  SPECIFIC_RANGE_MIN_BOTH: moment.Moment = moment(new Date(2017, 0)); //minimum January 1st, 2017
  SPECIFIC_RANGE_MAX_BOTH: moment.Moment = moment(); //maximum TODAY
  specificRangeFrom: moment.Moment = moment().subtract(29, "day"); //current 'from': 30 DAYS AGO
  specificRangeTo: moment.Moment = moment(); //current 'to': TODAY
  predefinedRanges: {} = { "1d": "Today", "1w": "Last week", "30d": "Last 30 days" };
  selectedPredefinedRange: string = "30d";
  rangeType: string = this.PREDEFINED_RANGE;

  heartRateInterday: []; //'activities-heart' => array of days
  heartRateInterdayLoading: boolean = false;

  //PAGINATION AND SORTING
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<interdayHeartRateDataSource>;

  constructor(private fitbitService: FitbitService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.fetchHeartRateInterDay(this.datePipe.transform(new Date(), "yyyy-MM-dd"), this.selectedPredefinedRange);

    this.fitbitService.getUserProfile().subscribe(response => {
      this.fitbitUser = response;
      console.log(this.fitbitUser);
    });
  }

  /**
   *
   * @param date A Date object
   */
  fetchHeartRateInterDay(from: string, to: string) {
    this.dataSource = null;
    this.heartRateInterdayLoading = true;
    this.fitbitService.getHeartRateInterday(from, to).subscribe(
      response => {
        console.log(response);
        this.dataSource = new MatTableDataSource(this.mapToDataSource(response));

        this.dataSource.filterPredicate = (data: interdayHeartRateDataSource, filter: string): boolean => {
          return (
            data.date.indexOf(filter) !== -1 ||
            (data["Out of Range"] &&
              data["Out of Range"].caloriesOut
                .toString()
                .toLowerCase()
                .indexOf(filter.toLowerCase()) !== -1) ||
            (data["Fat Burn"] &&
              data["Fat Burn"].caloriesOut
                .toString()
                .toLowerCase()
                .indexOf(filter.toLowerCase()) !== -1) ||
            (data.Cardio &&
              data.Cardio.caloriesOut
                .toString()
                .toLowerCase()
                .indexOf(filter.toLowerCase()) !== -1) ||
            (data.Peak &&
              data.Peak.caloriesOut
                .toString()
                .toLowerCase()
                .indexOf(filter.toLowerCase()) !== -1)
          );
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        console.log(this.dataSource.data);
      },
      error => {
        console.log(error);
        this.heartRateInterdayLoading = false;
      },
      () => {
        this.heartRateInterdayLoading = false;
      }
    );
  }

  updateTable() {
    const from: string =
      this.rangeType === this.PREDEFINED_RANGE ? moment().format("Y-MM-DD") : this.specificRangeFrom.format("Y-MM-DD");
    const to: string =
      this.rangeType === this.SPECIFIC_RANGE ? this.specificRangeTo.format("Y-MM-DD") : this.selectedPredefinedRange;

    this.fetchHeartRateInterDay(from, to);
  }

  specificRangeChanged(event: MatDatepickerInputEvent<moment.Moment>) {
    if (this.specificRangeFrom > this.specificRangeTo)
      if (event.targetElement.getAttribute("id") === "specific-range-from")
        this.specificRangeTo = this.specificRangeFrom;
      else this.specificRangeFrom = this.specificRangeTo;
  }

  rangeTypeChanged(value: string) {
    if (value) this.rangeType = value;
  }

  private mapToDataSource(response): Array<interdayHeartRateDataSource> {
    if (response && response["activities-heart"] !== undefined) {
      this.heartRateInterday = response["activities-heart"].reverse();
      return this.heartRateInterday.map(day => {
        let dataObject: interdayHeartRateDataSource = {} as interdayHeartRateDataSource;
        dataObject.date = day["dateTime"];

        const heartRateZones: Array<any> = day["value"]["heartRateZones"];

        heartRateZones.forEach(zone => {
          if (zone["caloriesOut"] !== undefined) {
            dataObject[zone["name"]] = {};
            dataObject[zone["name"]]["caloriesOut"] = zone["caloriesOut"].toFixed(2);
            dataObject[zone["name"]]["minutes"] = zone["minutes"];
          }
        });

        return dataObject;
      });
    }
  }

  sortNull() {} //this is to make 'predefinedRanges' be rendered as ordered in the variable declaration
}
