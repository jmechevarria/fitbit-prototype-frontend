import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator, MatSort } from "@angular/material";
import { FitbitService } from "src/app/services/fitbit.service";

@Component({
  selector: "interday-heartrate-table",
  templateUrl: "./interday-heartrate-table.component.html",
  styleUrls: ["./interday-heartrate-table.component.scss"]
})
export class InterdayHeartrateTableComponent implements OnInit {
  //INTERDAY DATA
  displayedColumns: string[] = ["date", "out-of-range", "fat-burn", "cardio", "peak"];
  HEART_RATE_ZONES = {
    OUTOFRANGE: "Out of Range",
    FATBURN: "Fat Burn",
    CARDIO: "Cardio",
    PEAK: "Peak"
  };

  //PAGINATION AND SORTING
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;

  heartRateIntraday: [];
  heartRateIntradayLoading: boolean = false;
  selectedRowIndex: number = -1;

  private _dataSource;

  @Input()
  set dataSource(dataSource) {
    this._dataSource = dataSource;
  }

  get dataSource() {
    return this._dataSource;
  }

  private _heartRateInterdayLoading: boolean = true;

  @Input()
  set heartRateInterdayLoading(heartRateInterdayLoading) {
    this._heartRateInterdayLoading = heartRateInterdayLoading;
  }

  get heartRateInterdayLoading() {
    return this._heartRateInterdayLoading;
  }

  private _heartRateInterday;

  @Input()
  set heartRateInterday(heartRateInterday) {
    this._heartRateInterday = heartRateInterday;
  }

  get heartRateInterday() {
    return this._heartRateInterday;
  }

  private _fitbitAccountID: number;

  @Input()
  set fitbitAccountID(fitbitAccountID: number) {
    this._fitbitAccountID = fitbitAccountID;
  }

  get fitbitAccountID(): number {
    return this._fitbitAccountID;
  }

  constructor(private fitbitService: FitbitService) {}

  ngOnInit() {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getIntraday(day, rowIndex) {
    this.highlightRow();
    this.heartRateIntraday = [];
    this.fitbitService.fetchHeartRateIntraday(this._fitbitAccountID, day.date, "1d").subscribe(
      response => {
        console.log(response);
        if (!!response["dataset"]) {
          this.heartRateIntraday = response["dataset"];
          this.highlightRow(rowIndex);
        }
      },
      error => {
        console.log(error);
        this.heartRateIntradayLoading = false;
      }
    );
  }

  highlightRow(rowIndex = undefined) {
    this.selectedRowIndex = rowIndex;
  }
}
