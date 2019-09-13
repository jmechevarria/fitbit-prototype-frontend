import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "intraday-heartrate-table",
  templateUrl: "./intraday-heartrate-table.component.html",
  styleUrls: ["./intraday-heartrate-table.component.scss"]
})
export class IntradayHeartrateTableComponent implements OnInit {
  //INTRADAY DATA
  intradayDisplayedColumns: string[] = ["time", "heart-rate"];

  private _heartRateIntraday;

  @Input()
  set heartRateIntraday(heartRateIntraday) {
    this._heartRateIntraday = heartRateIntraday;
  }

  get heartRateIntraday() {
    return this._heartRateIntraday;
  }
  private _heartRateIntradayLoading;

  @Input()
  set heartRateIntradayLoading(heartRateIntradayLoading) {
    this._heartRateIntradayLoading = heartRateIntradayLoading;
  }

  get heartRateIntradayLoading() {
    return this._heartRateIntradayLoading;
  }

  constructor() {}

  ngOnInit() {}

  // applyFilter(filterValue: string) {
  //   console.log(filterValue);
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
}
