import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitAccountService } from "src/app/services/fitbit-account.service";
import { UserService } from "src/app/services/user.service";
// import { FitbitAccountsPanelComponent } from "./fitbit-accounts-panel/fitbit-accounts-panel.component";

@Component({
  selector: "admin",
  templateUrl: "admin.component.html",
  styleUrls: ["admin.component.scss"]
})
export class AdminComponent implements OnInit, OnDestroy {
  currentUser;
  currentUserSubscription: Subscription;

  users;
  fitbitAccounts;

  constructor(
    private authenticationService: AuthenticationService,
    private fitbitAccountService: FitbitAccountService,
    private userService: UserService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadFitbitAccounts();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  // @ViewChild(FitbitAccountsPanelComponent, { static: false }) fitbitDataComponent: FitbitAccountsPanelComponent;
  unlinkFromFitbitAccount(params) {
    this.userService
      .unlinkFromFitbitAccount(params.userID, params.fitbitAccountID)
      .pipe(first())
      .subscribe(response => {
        const userID = response["rows"][0].caregiver_id,
          fitbitAccountID = response["rows"][0].fitbit_account_id;

        delete this.users[userID].fitbitAccounts[fitbitAccountID];
      });
  }

  linkToFitbitAccount(params) {
    this.userService
      .linkToFitbitAccount(params.userID, params.selectedFAIDs)
      .pipe(first())
      .subscribe(response => {
        console.log(response);
        const rows = response["rows"];
        rows.forEach(row => {
          const userID = row.caregiver_id,
            fitbitAccountID = row.fitbit_account_id;

          this.users[userID].fitbitAccounts[fitbitAccountID] = this.fitbitAccounts[fitbitAccountID];
        });
        // this.users = response["rows"];
        // console.log(this.users);
      });
  }

  private loadUsers() {
    this.userService
      .getAll()
      .pipe(first())
      .subscribe(response => {
        console.log(response);
        this.users = response["rows"];
        // console.log(this.users);
      });
  }

  private loadFitbitAccounts() {
    this.fitbitAccountService
      .getAll()
      .pipe(first())
      .subscribe(response => {
        this.fitbitAccounts = response["rows"];
      });
  }

  deleteUser(id: number) {
    console.log("show modal");
    // this.userService
    //   .delete(id)
    //   .pipe(first())
    //   .subscribe(() => {
    //     this.loadUsers();
    //   });
  }

  deleteFitbitAccount(id: number) {
    console.log("show modal");
    // this.fitbitAccountService
    //   .delete(id)
    //   .pipe(first())
    //   .subscribe(response => {
    //     const deletedID = response["rows"][0].id;
    //     delete this.fitbitAccounts[deletedID];
    //     this.users.forEach(user => {
    //       delete user.fitbitAccounts[deletedID];
    //     });
    //   });
  }
}
