import { NgModule } from "@angular/core";
import { ChartModule, HIGHCHARTS_MODULES } from "angular-highcharts";
import * as more from "highcharts/highcharts-more.src";
import * as HighchartsExporting from "highcharts/modules/exporting";
import * as HighchartsExportingOffline from "highcharts/modules/offline-exporting";

@NgModule({
  imports: [ChartModule],
  exports: [ChartModule],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [more, HighchartsExporting, HighchartsExportingOffline] } // add as factory to your providers
  ]
})
export class SharedModule {}
