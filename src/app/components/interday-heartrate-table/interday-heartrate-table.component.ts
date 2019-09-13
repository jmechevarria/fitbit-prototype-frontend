import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { FitbitService } from "src/app/services/fitbit.service";
import { interdayHeartRateDataSource } from "../fitbit-data/fitbit-data.component";

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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  heartRateIntraday: [];
  heartRateIntradayLoading: boolean = false;

  private _dataSource;
  selectedRowIndex: number = -1;

  @Input()
  set dataSource(dataSource) {
    this._dataSource = dataSource;
  }

  get dataSource() {
    return this._dataSource;
  }

  private _heartRateInterdayLoading;

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

  constructor(private fitbitService: FitbitService) {}

  ngOnInit() {}

  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getIntraday(day, rowIndex) {
    this.heartRateIntraday = [];
    this.heartRateIntradayLoading = true;
    this.fitbitService.getHeartRateIntraday(day.date, "1d").subscribe(
      response => {
        if (response["activities-heart-intraday"] && response["activities-heart-intraday"]["dataset"]) {
          this.heartRateIntraday = response["activities-heart-intraday"]["dataset"];
          this.highlightRow(rowIndex);
        }
      },
      error => {
        console.log(error);
        this.heartRateIntradayLoading = false;
      },
      () => {
        this.heartRateIntradayLoading = false;
      }
    );
  }

  highlightRow(rowIndex) {
    // console.log(rowIndex.id);
    this.selectedRowIndex = rowIndex;
  }
}
