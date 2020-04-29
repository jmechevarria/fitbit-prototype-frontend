import * as moment from "moment";

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { filter, map, switchMap } from "rxjs/operators";

import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitService } from "src/app/services/fitbit.service";
import { Subscription } from "rxjs";

@Component({
  selector: "devices-panel",
  templateUrl: "./devices-panel.component.html",
  styleUrls: ["./devices-panel.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DevicesPanelComponent implements OnInit, OnDestroy {
  @Input()
  clientAccounts;

  @Output() showHeartRateData_EE = new EventEmitter();

  // _clientAccounts;
  // private currentUser;
  states: Object = {};
  showStates: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private fitbitService: FitbitService
  ) {}

  ngOnInit() {
    this.showStates = false;
    console.log("devices oninit");

    const sub = this.authenticationService.currentUser$
      .pipe(
        filter((user) => !!user),
        map((user) => user["clientAccounts"]),
        switchMap((clientAccounts) => {
          const clientAccountsIDs = clientAccounts.map(
            (clientAccount) => clientAccount.id
          );

          return this.fitbitService.fetchLatestRecordedStates(
            clientAccountsIDs,
            moment()
          );
        }),
        map((states) => {
          // if (states) {
          console.log(states);
          if (states.length) {
            this.showStates = true;
            this.states = states.reduce((acc, state) => {
              // state["moment"] = moment
              //   .parseZone(state["week"])
              //   .add(state["second"], "s");
              state["moment"] = moment(state["week"]).add(state["second"], "s");
              console.log(moment(state.week).format());
              console.log(moment.utc(state.week).format());

              state["sleep_classification"] =
                state["sleep_status"] > 85 ? "good" : "bad";

              acc[state["person_id"]] = state;
              return acc;
            }, {});
          }
          // }

          console.log(this.states);
        })
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  age(birthdate) {
    if (birthdate) {
      return moment().diff(birthdate, "years");
    }
  }

  // callParent() {
  //   this.someEvent.next("somePhone");
  // }

  getHeartRateData(fitbitAccount) {
    this.showHeartRateData_EE.next(fitbitAccount);
  }
}
