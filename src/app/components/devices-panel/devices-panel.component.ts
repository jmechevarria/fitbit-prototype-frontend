import * as moment from "moment";

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from "@angular/core";
import { filter, map, switchMap, tap } from "rxjs/operators";

import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitService } from "src/app/services/fitbit.service";
import { Subscription } from "rxjs";

@Component({
  selector: "devices-panel",
  templateUrl: "./devices-panel.component.html",
  styleUrls: ["./devices-panel.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DevicesPanelComponent implements OnInit, OnDestroy {
  _fitbitAccounts;
  private currentUser;
  states: Object;
  showStates: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private fitbitService: FitbitService
  ) {}

  ngOnInit() {
    this.showStates = false;
    console.log("devices oninit");

    const sub$ = this.authenticationService.currentUser$
      .pipe(
        tap(user => (this.currentUser = user)),
        filter(user => !!user),
        map((user: any) => Object.keys(user.data.fitbitAccounts).join(",")),
        switchMap(ids =>
          this.fitbitService.fetchLatestRecordedStates(ids, moment())
        ),
        map(states => {
          if (states.length) {
            this.showStates = true;
            this.states = states.reduce((acc, state) => {
              state["moment"] = moment
                .parseZone(state["week"])
                .add(state["second"], "s")
                .format("LLL");

              state["sleep_quality"] =
                state["sleep_status"] > 85 ? "good" : "bad";

              acc[state["person_id"]] = state;
              return acc;
            }, {});
          }
        })
      )
      .subscribe();

    this.subscriptions.push(sub$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s$ => s$.unsubscribe());
  }

  age(birthdate) {
    if (birthdate) {
      return moment().diff(birthdate, "years");
    }
  }

  @Input()
  set fitbitAccounts(fitbitAccounts) {
    this._fitbitAccounts = fitbitAccounts;
  }

  get fitbitAccounts() {
    return this._fitbitAccounts;
  }

  @Output() showHeartRateData_EE = new EventEmitter();

  // callParent() {
  //   this.someEvent.next("somePhone");
  // }

  getHeartRateData(fitbitAccount) {
    this.showHeartRateData_EE.next(fitbitAccount);
  }
}
