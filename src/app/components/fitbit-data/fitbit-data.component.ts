import { Component, OnInit, ViewChild } from "@angular/core";
import { FitbitService } from "src/app/services/fitbit.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { Chart } from "angular-highcharts";
import * as jsPDF from "jspdf";
// import { DailySummaryService } from "src/app/services/daily_summary.service";

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
  styleUrls: ["./fitbit-data.component.scss"]
})
export class FitbitDataComponent implements OnInit {
  // fitbitUser: any;
  constructor(
    private fitbitService: FitbitService,
    // private dailySummaryService: DailySummaryService,
    private datePipe: DatePipe
  ) {}
  test: boolean = false;

  //DATE RANGE
  PREDEFINED_RANGE: string = "predefined-range";
  SPECIFIC_RANGE: string = "specific-range";
  SPECIFIC_RANGE_MIN_BOTH: moment.Moment = moment(new Date(2017, 0)); //minimum January 1st, 2017
  SPECIFIC_RANGE_MAX_BOTH: moment.Moment = moment(); //maximum TODAY
  specificRangeFrom: moment.Moment = moment().subtract(29, "day"); //current 'from': 30 DAYS AGO
  specificRangeTo: moment.Moment = moment(); //current 'to': TODAY
  predefinedRanges: {} = {
    "1d": "shared.today",
    "1w": "shared.last_7_days",
    "30d": "shared.last_30_days"
  };
  selectedPredefinedRange: string = "30d";
  rangeType: string = this.PREDEFINED_RANGE;

  heartRateInterday;
  heartRateInterdayLoading: boolean = false;

  //PAGINATION AND SORTING
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  interdayDataSource: MatTableDataSource<InterdayDataSource>;
  showComponent: boolean;
  fitbitAccount;
  langSubscription: any;

  ngOnInit() {
    this.interdayDataSource = new MatTableDataSource<InterdayDataSource>();
    this.interdayDataSource.filterPredicate = (data: InterdayDataSource, filter: string): boolean => {
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

  getHeartRateInterday(fitbitAccount, from?: string, to?: string) {
    this.fitbitAccount = fitbitAccount;
    this.heartRateInterdayLoading = true;
    this.showComponent = true;
    this.fitbitService
      .fetchHeartRateInterday(
        this.fitbitAccount.id,
        !!from ? from : this.datePipe.transform(new Date(), "yyyy-MM-dd"),
        !!to ? to : this.selectedPredefinedRange,
        moment().format("Z")
      )
      .subscribe(
        response => {
          this.interdayDataSource.data = this.responseToDataSource(response);
          this.heartRateInterdayLoading = false;
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
    this.hideIntradayData();
    const from: string =
      this.rangeType === this.PREDEFINED_RANGE ? moment().format("Y-MM-DD") : this.specificRangeFrom.format("Y-MM-DD");
    const to: string =
      this.rangeType === this.SPECIFIC_RANGE ? this.specificRangeTo.format("Y-MM-DD") : this.selectedPredefinedRange;

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
    if (!!response) {
      this.heartRateInterday = response;
      return Object.values(this.heartRateInterday)
        .reverse()
        .map(day => {
          let dataObject = {} as InterdayDataSource;
          dataObject.date = day["date"];

          dataObject.hrz_1 = { caloriesOut: day["hrz_1_calories"].toFixed(2), minutes: day["hrz_1_minutes"] };
          dataObject.hrz_2 = { caloriesOut: day["hrz_2_calories"].toFixed(2), minutes: day["hrz_2_minutes"] };
          dataObject.hrz_3 = { caloriesOut: day["hrz_3_calories"].toFixed(2), minutes: day["hrz_3_minutes"] };
          dataObject.hrz_4 = { caloriesOut: day["hrz_4_calories"].toFixed(2), minutes: day["hrz_4_minutes"] };
          dataObject.steps = day["steps"];

          return dataObject;
        });
    }
  }

  sortNull() {} //this is to make 'predefinedRanges' be rendered as ordered in the variable declaration

  HEART_RATE_ZONES = {
    hrz_1: "hrz_1",
    hrz_2: "hrz_2",
    hrz_3: "hrz_3",
    hrz_4: "hrz_4"
  };

  hrz_translations = {
    [this.HEART_RATE_ZONES.hrz_1]: "dashboard.fitbit_data.interday.out_of_range",
    [this.HEART_RATE_ZONES.hrz_2]: "dashboard.fitbit_data.interday.fat_burn",
    [this.HEART_RATE_ZONES.hrz_3]: "dashboard.fitbit_data.interday.cardio",
    [this.HEART_RATE_ZONES.hrz_4]: "dashboard.fitbit_data.interday.peak"
  };

  displayedColumns: string[] = [
    "date",
    this.HEART_RATE_ZONES.hrz_1,
    this.HEART_RATE_ZONES.hrz_2,
    this.HEART_RATE_ZONES.hrz_3,
    this.HEART_RATE_ZONES.hrz_4,
    "steps"
  ];
  selectedRowIndex: number = -1;

  //INTRADAY DATA
  heartRateIntradayLoading: boolean = false;
  heartRateIntradayLoadingError: boolean = false;
  intradayChartOptions;

  chartTypes = [
    { id: "line", label: "Línea", icon: "timeline" },
    { id: "bar", label: "Barra", icon: "bar_chart" }
  ];

  public chartType = "line";
  showIntradayData = false;
  // chart: Chart;
  chart = new Chart({
    chart: {
      type: "line",
      zoomType: "x"
      // renderTo: 'container'
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        // hour: "%I %p",
        minute: "%I:%M %p"
      }
    },
    yAxis: {
      title: {
        text: "Heart rate"
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      positioner: function() {
        return { x: 0, y: 0 };
      },
      shadow: false,
      borderWidth: 0,
      backgroundColor: "rgba(255,255,255,0.8)"
    },
    navigation: {
      buttonOptions: {
        enabled: true
      }
    },
    exporting: {
      fallbackToExportServer: false
    }
  });

  applyFilter(filterValue: string) {
    this.interdayDataSource.filter = filterValue.trim().toLowerCase();

    if (this.interdayDataSource.paginator) {
      this.interdayDataSource.paginator.firstPage();
    }
  }

  getIntraday(day, rowIndex) {
    this.showIntradayData = true;
    // if (!this.chart) this.createChart();

    this.highlightRow();
    this.intradayChartOptions = null;
    this.heartRateIntradayLoading = true;
    this.chart.removeSeries(0);

    if (this.chart.ref) {
      this.chart.ref.showLoading();
      this.chart.ref.update(
        {
          title: {
            text: this.fitbitAccount.fullname + " | Heart Rate Time Series"
          },
          subtitle: {
            text: day.date
          }
        },
        true,
        true,
        true
      );
    }

    this.fitbitService.fetchHeartRateIntraday(this.fitbitAccount["id"], day.date).subscribe(
      heartRateIntraday => {
        const points = [];
        for (const secondHeartBeatPair of (heartRateIntraday as Array<Object>).reverse()) {
          points.push([
            moment(day.date)
              .add(secondHeartBeatPair["second"], "seconds")
              // .add(moment().utcOffset(), "minutes")
              .valueOf(),
            secondHeartBeatPair["heart_beat"]
          ]);
        }

        this.intradayChartOptions = {
          title: {
            text: this.fitbitAccount.fullname + " | Heart Rate Time Series"
          },
          subtitle: {
            text: day.date
          },
          series: [
            {
              name: "Heart rate",
              data: points,
              showInLegend: false
            }
          ]
        };

        this.chart.ref.update(this.intradayChartOptions, true, true, true);
        this.chart.ref.hideLoading();

        this.highlightRow(rowIndex);
        this.heartRateIntradayLoading = false;
      },
      error => {
        console.log(error);
        this.heartRateIntradayLoading = false;
        this.heartRateIntradayLoadingError = true;
      }
    );
  }

  highlightRow(rowIndex = undefined) {
    this.selectedRowIndex = rowIndex;
  }

  exportChart(event, format) {
    const canvas = document.getElementById("chart") as HTMLCanvasElement;
    if (format === "png") {
      const anchor = event.target.parentNode;
      anchor.href = canvas.toDataURL();
      anchor.download = "test.png";
    } else if (format === "pdf") {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF();

      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("test.pdf");
    }
  }

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
