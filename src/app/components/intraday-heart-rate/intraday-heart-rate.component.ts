import { Component, OnInit, Input } from "@angular/core";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Label, Color } from "ng2-charts";
import * as jsPDF from "jspdf";

@Component({
  selector: "intraday-heart-rate",
  templateUrl: "./intraday-heart-rate.component.html",
  styleUrls: ["./intraday-heart-rate.component.scss"]
})
export class IntradayHeartRateComponent implements OnInit {
  //INTRADAY DATA
  intradayDisplayedColumns: string[] = ["time", "heart-rate"];

  private _heartRateIntraday;

  @Input()
  set heartRateIntraday(heartRateIntraday) {
    this.heartRateIntradayLoading = true;
    this._heartRateIntraday = heartRateIntraday;

    //populate chart
    if (!!this._heartRateIntraday) {
      if (this._heartRateIntraday.length > 0) {
        this.populateIntradayChart();
      } else this.clearIntradayData();
    }
  }

  get heartRateIntraday() {
    return this._heartRateIntraday;
  }
  @Input()
  heartRateIntradayLoading;

  chartTypes = [{ id: "line", label: "Línea", icon: "timeline" }, { id: "bar", label: "Barra", icon: "bar_chart" }];
  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  public chartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    annotation: 1,
    maintainAspectRatio: false
  };

  public chartColors: Color[] = [
    {
      borderColor: "black",
      backgroundColor: "rgba(255,0,0,0.3)"
    }
  ];
  public chartLegend = true;
  public chartType = "line";
  public chartPlugins = [];

  constructor() {}

  ngOnInit() {}

  populateIntradayChart() {
    this.chartData.push({ data: [], label: "Ritmo cardíaco" });
    this.chartLabels = [
      "2 AM",
      "4 AM",
      "6 AM",
      "8 AM",
      "10 AM",
      "12 M",
      "2 PM",
      "4 PM",
      "6 PM",
      "8 PM",
      "10 PM",
      "12 AM"
    ];
    this.chartData[0].data = this._heartRateIntraday.map(element => element.value);

    this.heartRateIntradayLoading = false;
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

  private clearIntradayData() {
    this.chartData = [];
  }
}
