import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FitbitService } from "src/app/services/fitbit.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
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
  // test: boolean = true;

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
    // private dailySummaryService: DailySummaryService,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {}

  //PAGINATION AND SORTING
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    console.log("oninit");

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

  getHeartRateInterday(fitbitAccount, from?: string, to?: string) {
    console.log(from, to, moment.utc());

    this.hideIntradayData();
    this.fitbitAccount = fitbitAccount;
    this.heartRateInterdayLoading = true;
    this.showComponent = true;
    const sub = this.fitbitService
      .fetchHeartRateInterday(
        this.fitbitAccount.id,
        // from ? from : this.datePipe.transform(new Date(), "yyyy-MM-dd"),
        from ? from : moment.utc().format("YYYY-MM-DD"),
        to ? to : this.selectedPredefinedRange
      )
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

  updateTable() {
    this.hideIntradayData();
    const from: string =
      this.rangeType === this.PREDEFINED_RANGE
        ? moment().format("Y-MM-DD")
        : this.specificRangeFrom.format("Y-MM-DD");
    const to: string =
      this.rangeType === this.SPECIFIC_RANGE
        ? this.specificRangeTo.format("Y-MM-DD")
        : this.selectedPredefinedRange;

    this.getHeartRateInterday(this.fitbitAccount, from, to);
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

  sortNull() {} //this is to make 'predefinedRanges' be rendered as ordered in the variable declaration

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

          // renderTo: 'container'
        },
        xAxis: {
          title: {
            text: time,
          },
          type: "datetime",
          dateTimeLabelFormats: {
            // hour: "%I %p",
            minute: "%I:%M %p",
          },
        },
        // yAxis: {
        //   title: {
        //     text: "Heartd rate"
        //   }
        // },
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
          // formatter: function() {
          //   return (
          //     "<b>" +
          //     this.series.name +
          //     "</b><br/>" +
          //     Chart.dateFormat("%e - %b - %Y", new Date(this.x)) +
          //     " date, " +
          //     this.y +
          //     " Kg."
          //   );
          // }
        },
        navigation: {
          buttonOptions: {
            enabled: true,
          },
        },
        exporting: {
          fallbackToExportServer: false,
        },
        // time: {
        //   useUTC: true
        // }
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
    // this.test = false;

    const sub = this.fitbitService
      .fetchHeartRateIntraday(
        this.fitbitAccount["id"],
        moment(day.date).format()
      )
      .subscribe(
        (heartRateIntraday) => {
          if (heartRateIntraday) {
            //since the data comes in the form [seconds_elapsed_from_day_start => heart_beat_value],
            //and day start refers to utc, the client has to counter the time difference by adding/subtracting hours
            //before passing the points to the chart
            const points = [],
              dayMoment = moment.utc(day.date).add(moment().utcOffset(), "m");

            for (const secondHeartBeatPair of (heartRateIntraday[
              "data"
            ] as Array<Object>).reverse()) {
              points.push([
                dayMoment
                  .clone()
                  .add(secondHeartBeatPair["second"], "seconds")
                  .valueOf(),
                secondHeartBeatPair["heart_beat"],
              ]);
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
                  type: "line",
                  // name: this.translate.stream("shared.heart_rate"),
                  name: "Heart rate",
                  data: points,
                  showInLegend: false,
                },
              ],
              yAxis: {
                title: {
                  text: "Heart rate",
                  // text: this.translate.stream("shared.heart_rate")
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

  // exportChart(event, format) {
  //   const canvas = document.getElementById("chart") as HTMLCanvasElement;
  //   if (format === "png") {
  //     const anchor = event.target.parentNode;
  //     anchor.href = canvas.toDataURL();
  //     anchor.download = "test.png";
  //   } else if (format === "pdf") {
  //     const imgData = canvas.toDataURL("image/png", 1.0);
  //     const pdf = new jsPDF();

  //     pdf.addImage(imgData, "PNG", 0, 0);
  //     pdf.save("test.pdf");
  //   }
  // }

  /**
   * line, bar, radar, pie, polarArea, doughnut, bubble and scatter
   */
  changeChartType(event, type) {
    event.preventDefault();
    this.chartType = type;
  }

  hideIntradayData() {
    this.showIntradayData = false;
    this.highlightRow();
  }

  // createChart() {
  //   this.chart = new Chart({
  //     chart: {
  //       type: "line",
  //       zoomType: "x"
  //       // renderTo: 'container'
  //     },
  //     xAxis: {
  //       type: "datetime",
  //       dateTimeLabelFormats: {
  //         // hour: "%I %p",
  //         minute: "%I:%M %p"
  //       }
  //     },
  //     yAxis: {
  //       title: {
  //         text: "Heart rate"
  //       }
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     tooltip: {
  //       positioner: function() {
  //         return { x: 0, y: 0 };
  //       },
  //       shadow: false,
  //       borderWidth: 0,
  //       backgroundColor: "rgba(255,255,255,0.8)"
  //     }
  //   });
  // }

  // private clearIntradayData() {}
}
