import { Component, OnInit, OnDestroy } from "@angular/core";
import { MDBModalRef } from "angular-bootstrap-md";
import { Subject, Subscription } from "rxjs";
import { Chart } from "angular-highcharts";
import { TranslateService } from "@ngx-translate/core";

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
  chartType = "line";
  chart: Chart;

  action: Subject<any> = new Subject();
  private subscriptions: Subscription[] = [];

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
        this._content.sleepStatusAverage = 0;
        this._content.steps = 0;
        this._content.floors = 0;

        states.forEach((elem: any, index) => {
          this._content.sleepStatusAverage += elem.sleep_status;
          if (this._content.steps < elem.steps)
            this._content.steps = elem.steps;
          if (this._content.floors < elem.floors)
            this._content.floors = elem.floors;

          data.push([index, elem.hbpm]);
        });

        this._content.sleepStatusAverage /= states.length;

        let titleText, subtitleText;
        const sub = this.translate
          .get("notifications_panel.dialog.incident_details.chart_title")
          .subscribe((t) => {
            // titleText = t;
          });

        const sub2 = this.translate
          .get("notifications_panel.dialog.incident_details.chart_subtitle")
          .subscribe((st) => {
            subtitleText = st;
          });

        this.subscriptions.push(sub, sub2);

        this.initChart({
          title: {
            // text: titleText,
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
            // text: this._content.timestamp.format("LLL"),
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
    // if (this._content.wearable_states) {
    // }
  }

  get content() {
    return this._content;
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    console.log("ngondestroy dialog");

    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onClose() {
    this.action.next("yes");
  }

  initChart(config) {
    this.chart = new Chart({
      ...{
        chart: {
          type: "line",
          zoomType: "x",
        },
        credits: {
          enabled: false,
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
