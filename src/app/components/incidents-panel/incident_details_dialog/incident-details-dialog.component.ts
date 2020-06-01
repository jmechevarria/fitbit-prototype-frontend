import { Component, OnInit, OnDestroy } from "@angular/core";
import { MDBModalRef } from "angular-bootstrap-md";
import { Subject, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);
import offline from "highcharts/modules/offline-exporting";
offline(Highcharts);

@Component({
  selector: "incident-details-dialog",
  templateUrl: "./incident-details-dialog.component.html",
  styleUrls: ["./incident-details-dialog.component.scss"],
})
export class IncidentDetailsDialogComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  title: string;
  private _content: any = {};
  header: any[];
  chart: Highcharts.Chart;

  action: Subject<any> = new Subject();
  private subscriptions: Subscription[] = [];
  CHART_LABELS = {
    X_AXIS: null,
    Y_AXIS: null,
    STEPS: null,
    HEART_RATE: null,
    // NO_DATA: null,
    MENU: {
      FULL_SCREEN: null,
      PRINT_CHART: null,
      DOWNLOAD_PNG: null,
      DOWNLOAD_JPEG: null,
      DOWNLOAD_PDF: null,
      DOWNLOAD_SVG: null,
      CONTEXT_MENU: null,
      LOADING: null,
    },
  };

  constructor(
    public modalRef: MDBModalRef,
    private translate: TranslateService
  ) {}

  set content(content) {
    this._content = content;

    if (this._content.wearable_states) {
      const states = Object.values(this._content.wearable_states);

      if (states.length) {
        const data = [];
        this._content.sleepStatus = 0;
        this._content.steps = 0;
        this._content.floors = 0;

        states.forEach((elem: any, index) => {
          this._content.sleepStatus += elem.sleep_status;
          this._content.steps += elem.steps;
          this._content.floors += elem.floors;

          if (elem.hbpm) data.push([index, elem.hbpm]);
        });

        this._content.sleepStatus /= states.length;

        let subtitleText;

        const sub = this.translate
          .get("incidents_panel.dialog.incident_details.chart_subtitle")
          .subscribe((st) => {
            subtitleText = st;
          });

        this.subscriptions.push(sub);

        this.initChart({
          title: {
            text: `${content.client_account.firstname} ${
              content.client_account.lastname
            }
              ${
                content.client_account.lastname2
                  ? content.client_account.lastname2
                  : ""
              }`,
          },
          subtitle: {
            text: subtitleText,
          },
          series: [
            {
              type: "line",
              name: "Heart rate",
              data: data,
              showInLegend: false,
            },
          ],
          yAxis: {
            title: {
              text: "Heart rate",
            },
          },
        });
      }
    }
  }

  get content() {
    return this._content;
  }

  ngOnInit() {
    const sub = this.translate.stream("shared.time").subscribe((t) => {
      this.CHART_LABELS.X_AXIS = t;
    });

    const sub2 = this.translate.stream("shared.values").subscribe((t) => {
      this.CHART_LABELS.Y_AXIS = t;
    });

    const sub3 = this.translate.stream("shared.heart_rate").subscribe((t) => {
      this.CHART_LABELS.HEART_RATE = t;
    });

    const sub4 = this.translate.stream("shared.steps").subscribe((t) => {
      this.CHART_LABELS.STEPS = t;
    });

    this.subscriptions.push(sub, sub2, sub3, sub4);

    for (const i of Object.keys(this.CHART_LABELS.MENU)) {
      this.subscriptions.push(
        this.translate
          .stream(`dashboard.fitbit_data.intraday.chart.${i.toLowerCase()}`)
          .subscribe((t) => {
            this.CHART_LABELS.MENU[i] = t;
          })
      );
    }
  }

  ngOnDestroy(): void {
    console.log("ngondestroy dialog");

    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onClose() {
    this.action.next("yes");
  }

  initChart(config?) {
    console.log(this.content.wearable_states);

    this.chart = Highcharts.chart("chart", {
      ...{
        chart: {
          type: "line",
          zoomType: "x",
        },
        lang: {
          viewFullscreen: this.CHART_LABELS.MENU.FULL_SCREEN,
          printChart: this.CHART_LABELS.MENU.PRINT_CHART,
          downloadPNG: this.CHART_LABELS.MENU.DOWNLOAD_PNG,
          downloadJPEG: this.CHART_LABELS.MENU.DOWNLOAD_JPEG,
          downloadPDF: this.CHART_LABELS.MENU.DOWNLOAD_PDF,
          downloadSVG: this.CHART_LABELS.MENU.DOWNLOAD_SVG,
          contextButtonTitle: this.CHART_LABELS.MENU.CONTEXT_MENU,
          loading: this.CHART_LABELS.MENU.LOADING,
          // noData: this.CHART_LABELS.NO_DATA,
        },
        series: [],
        title: {
          text: "",
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
}
