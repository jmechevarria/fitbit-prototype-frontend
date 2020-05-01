import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FitbitService } from "src/app/services/fitbit.service";
import * as moment from "moment";
import "moment-timezone";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { Chart } from "angular-highcharts";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

export interface InterdayDataSource {
  date: string;
  hrz_1: { caloriesOut: string; minutes: string };
  hrz_2: { caloriesOut: string; minutes: string };
  hrz_3: { caloriesOut: string; minutes: string };
  hrz_4: { caloriesOut: string; minutes: string };
  steps: number;
}

@Component({
  selector: "fitbit-data",
  templateUrl: "./fitbit-data.component.html",
  styleUrls: ["./fitbit-data.component.scss"],
})
export class FitbitDataComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  //DATE RANGE
  PREDEFINED_RANGE: string = "predefined-range";
  SPECIFIC_RANGE: string = "specific-range";
  SPECIFIC_RANGE_MIN_BOTH: moment.Moment = moment("2017-01-01"); //minimum January 1st, 2017
  SPECIFIC_RANGE_MAX_BOTH: moment.Moment = moment(); //maximum TODAY
  specificRangeFrom: moment.Moment = moment().subtract(29, "day"); //current 'from': 30 DAYS AGO
  specificRangeTo: moment.Moment = moment(); //current 'to': TODAY

  predefinedRanges: {} = {
    "1d": "shared.today",
    "1w": "shared.last_7_days",
    "30d": "shared.last_30_days",
  };
  selectedPredefinedRange: string = "30d";
  rangeType: string = this.PREDEFINED_RANGE;

  heartRateInterday;
  heartRateInterdayLoading: boolean = false;
  interdayDataSource: MatTableDataSource<InterdayDataSource>;
  showComponent: boolean;
  fitbitAccount;
  langSubscription: any;

  constructor(
    private fitbitService: FitbitService,
    private translate: TranslateService
  ) {}

  //PAGINATION AND SORTING
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.interdayDataSource = new MatTableDataSource<InterdayDataSource>();
    this.interdayDataSource.filterPredicate = (
      data: InterdayDataSource,
      filter: string
    ): boolean => {
      return (
        data.date.indexOf(filter) !== -1 ||
        (data.hrz_1 &&
          data.hrz_1.caloriesOut
            .toString()
            .toLowerCase()
            .indexOf(filter.toLowerCase()) !== -1) ||
        (data.hrz_2 &&
          data.hrz_2.caloriesOut
            .toString()
            .toLowerCase()
            .indexOf(filter.toLowerCase()) !== -1) ||
        (data.hrz_3 &&
          data.hrz_3.caloriesOut
            .toString()
            .toLowerCase()
            .indexOf(filter.toLowerCase()) !== -1) ||
        (data.hrz_4 &&
          data.hrz_4.caloriesOut
            .toString()
            .toLowerCase()
            .indexOf(filter.toLowerCase()) !== -1)
      );
    };

    this.interdayDataSource.paginator = this.paginator;
    this.interdayDataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getHeartRateInterday(fitbitAccount) {
    const from: string =
      this.rangeType === this.PREDEFINED_RANGE
        ? moment().format("YYYY-MM-DD")
        : this.specificRangeFrom.format("YYYY-MM-DD");
    const to: string =
      this.rangeType === this.SPECIFIC_RANGE
        ? this.specificRangeTo.format("YYYY-MM-DD")
        : this.selectedPredefinedRange;

    this.hideIntradayData();
    this.fitbitAccount = fitbitAccount;
    this.heartRateInterdayLoading = true;
    this.showComponent = true;
    const sub = this.fitbitService
      .fetchHeartRateInterday(this.fitbitAccount.id, from, to)
      .subscribe(
        (response) => {
          this.interdayDataSource.data = this.responseToDataSource(response);
          this.heartRateInterdayLoading = false;
        },
        (error) => {
          console.log(error);
          this.heartRateInterdayLoading = false;
        },
        () => {
          this.heartRateInterdayLoading = false;
        }
      );

    this.subscriptions.push(sub);
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

  private responseToDataSource(response): Array<InterdayDataSource> {
    if (response) {
      this.heartRateInterday = response;
      return Object.values(this.heartRateInterday).map((day) => {
        let dataObject = {} as InterdayDataSource;
        dataObject.date = moment.parseZone(day["date"]).format("YYYY-MM-DD");

        dataObject.hrz_1 = {
          caloriesOut: day["hrz_1_calories"]
            ? day["hrz_1_calories"].toFixed(2)
            : null,
          minutes: day["hrz_1_minutes"],
        };
        dataObject.hrz_2 = {
          caloriesOut: day["hrz_2_calories"]
            ? day["hrz_2_calories"].toFixed(2)
            : null,
          minutes: day["hrz_2_minutes"],
        };
        dataObject.hrz_3 = {
          caloriesOut: day["hrz_3_calories"]
            ? day["hrz_3_calories"].toFixed(2)
            : null,
          minutes: day["hrz_3_minutes"],
        };
        dataObject.hrz_4 = {
          caloriesOut: day["hrz_4_calories"]
            ? day["hrz_4_calories"].toFixed(2)
            : null,
          minutes: day["hrz_4_minutes"],
        };
        dataObject.steps = day["steps"];

        return dataObject;
      });
    }

    return [];
  }

  HEART_RATE_ZONES = {
    hrz_1: "hrz_1",
    hrz_2: "hrz_2",
    hrz_3: "hrz_3",
    hrz_4: "hrz_4",
  };

  hrz_translations = {
    [this.HEART_RATE_ZONES.hrz_1]:
      "dashboard.fitbit_data.interday.out_of_range",
    [this.HEART_RATE_ZONES.hrz_2]: "dashboard.fitbit_data.interday.fat_burn",
    [this.HEART_RATE_ZONES.hrz_3]: "dashboard.fitbit_data.interday.cardio",
    [this.HEART_RATE_ZONES.hrz_4]: "dashboard.fitbit_data.interday.peak",
  };

  displayedColumns: string[] = [
    "date",
    this.HEART_RATE_ZONES.hrz_1,
    this.HEART_RATE_ZONES.hrz_2,
    this.HEART_RATE_ZONES.hrz_3,
    this.HEART_RATE_ZONES.hrz_4,
    "steps",
  ];
  selectedRowIndex: number = -1;

  //INTRADAY DATA
  heartRateIntradayLoading: boolean = false;
  heartRateIntradayLoadingError: boolean = false;

  chartTypes = [
    { id: "line", label: "Línea", icon: "timeline" },
    { id: "bar", label: "Barra", icon: "bar_chart" },
  ];

  public chartType = "line";
  showIntradayData = false;
  chart: Chart;

  initChart(config) {
    let time;
    const sub = this.translate.get("shared.time").subscribe((t) => {
      time = t;
    });

    this.subscriptions.push(sub);
    this.chart = new Chart({
      ...{
        chart: {
          type: "line",
          zoomType: "x",
        },
        xAxis: {
          title: {
            text: time,
          },
          type: "datetime",
          dateTimeLabelFormats: {
            minute: "%I:%M %p",
          },
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          positioner: function () {
            return { x: 0, y: 0 };
          },
          shadow: false,
          borderWidth: 0,
          backgroundColor: "rgba(255,255,255,0.8)",
        },
        navigation: {
          buttonOptions: {
            enabled: true,
          },
        },
        exporting: {
          fallbackToExportServer: false,
        },
      },
      ...config,
    });
  }

  applyFilter(filterValue: string) {
    this.interdayDataSource.filter = filterValue.trim().toLowerCase();

    if (this.interdayDataSource.paginator) {
      this.interdayDataSource.paginator.firstPage();
    }
  }

  getIntraday(day, rowIndex) {
    if (this.chart) this.chart.removeSeries(0);
    this.highlightRow();
    this.showIntradayData = true;
    this.heartRateIntradayLoading = true;
    this.heartRateIntradayLoadingError = false;

    const sub = this.fitbitService
      .fetchHeartRateIntraday(
        this.fitbitAccount["id"],
        moment(day.date).format()
      )
      .subscribe(
        (heartRateIntraday) => {
          if (heartRateIntraday) {
            //since the data comes in the form [seconds_elapsed_from_week_start => heart_beat_value],
            //and day start refers to utc, the client has to counter the time difference by adding/subtracting hours
            //before passing the points to the chart
            const hbpm = [],
              stepsPoints = [],
              dayMoment = moment
                .utc(day.date)
                .startOf("isoWeek")
                .add(moment(day.date).utcOffset(), "m");

            for (const data of heartRateIntraday["data"] as Array<Object>) {
              const x = dayMoment
                .clone()
                .add(data["second"], "seconds")
                .valueOf();

              hbpm.push([x, data["heart_beat"]]);
              stepsPoints.push([x, data["steps"]]);
            }

            this.initChart({
              title: {
                text:
                  this.fitbitAccount.firstname +
                  " " +
                  this.fitbitAccount.lastname +
                  " " +
                  (this.fitbitAccount.lastname2
                    ? this.fitbitAccount.lastname2
                    : ""),
              },
              subtitle: {
                text: day.date,
              },
              series: [
                {
                  type: "column",
                  name: "Steps",
                  data: stepsPoints,
                  color: "green",
                },
                {
                  type: "line",
                  name: "Heart rate",
                  data: hbpm,
                  color: "pink",
                },
              ],
              yAxis: {
                title: {
                  text: "Values",
                },
              },
            });
          } else {
            //empty response
            this.chart = null;
          }

          this.highlightRow(rowIndex);
          this.heartRateIntradayLoading = false;
        },
        (error) => {
          console.log(error);
          this.heartRateIntradayLoading = false;
          this.heartRateIntradayLoadingError = true;
        }
      );

    this.subscriptions.push(sub);
  }

  highlightRow(rowIndex = undefined) {
    this.selectedRowIndex = rowIndex;
  }

  hideIntradayData() {
    this.showIntradayData = false;
    this.highlightRow();
  }
}
