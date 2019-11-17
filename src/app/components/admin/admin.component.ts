import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitAccountService } from "src/app/services/fitbit-account.service";
import { UserService } from "src/app/services/user.service";
import { FitbitService } from "src/app/services/fitbit.service";
import { Router } from "@angular/router";
import { parseWindowHash } from "../../helpers/parseWindowHash";
import { ImplicitGrantFlowResponse } from "../../models/ImplicitGrantFlowResponse";

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
    private userService: UserService,
    private fitbitService: FitbitService,
    private router: Router
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    const hash = window.location.hash;
    const search = window.location.search;

    if (hash !== "") {
      if (search.includes("error") || search.includes("error_description")) {
        this.router.navigate([""]);
      } else if (hash.includes("access_token")) {
        const implicitGrantFlowResponse = parseWindowHash<ImplicitGrantFlowResponse>(hash);
        console.log(implicitGrantFlowResponse);
        this.fitbitAccountService
          .patch(this.fitbitService.tempFitbitAccountID, {
            user_id: implicitGrantFlowResponse.user_id,
            access_token: implicitGrantFlowResponse.access_token,
            expires_in: implicitGrantFlowResponse.expires_in
          })
          .subscribe(
            () => {
              //on success, we remove tempFitbitAccountID from local storage since it's not needed anymore
              this.fitbitService.tempFitbitAccountID = null;
              window.location.hash = "";
              window.location.search = "";
            },
            error => {
              console.log(error);
            }
          );
      }
    }

    this.loadUsers();
    this.loadFitbitAccounts();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  unlinkFromFitbitAccount(params) {
    this.userService
      .unlinkFromFitbitAccount(params.userID, params.fitbitAccountID)
      .pipe(first())
      .subscribe(response => {
        const userID = response["caregiver_id"],
          fitbitAccountID = response["fitbit_account_id"];

        delete this.users[userID].fitbitAccounts[fitbitAccountID];
      });
  }

  linkToFitbitAccount(params) {
    this.userService
      .linkToFitbitAccount(params.userID, params.selectedFAIDs)
      .pipe(first())
      .subscribe(response => {
        (response as Array<any>).forEach(row => {
          const userID = row.caregiver_id,
            fitbitAccountID = row.fitbit_account_id;

          this.users[userID].fitbitAccounts[fitbitAccountID] = this.fitbitAccounts[fitbitAccountID];
        });
      });
  }

  private loadUsers() {
    this.userService
      .getAll()
      .pipe(first())
      .subscribe(response => {
        this.users = response;
      });
  }

  private loadFitbitAccounts() {
    this.fitbitAccountService
      .getAll()
      .pipe(first())
      .subscribe(response => {
        this.fitbitAccounts = response;
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

  refreshAccessToken(fitbitAccountID: number) {
    if (!!fitbitAccountID) {
      this.fitbitAccountService
        .get(fitbitAccountID)
        .pipe(first())
        .subscribe(fitbitAccount => {
          if (!!fitbitAccount[fitbitAccountID]["client_id"])
            this.fitbitService.requestAccess(fitbitAccount[fitbitAccountID]);
        });
    }
  }

  revokeAccessToken(fitbitAccountID: number) {
    this.fitbitService.relinquishAccess(fitbitAccountID).subscribe();
  }
}
