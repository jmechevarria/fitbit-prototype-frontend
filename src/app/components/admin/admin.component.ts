import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ClientAccountService } from "src/app/services/client-account.service";
import { UserService } from "src/app/services/user.service";
import { FitbitService } from "src/app/services/fitbit.service";
import { Router } from "@angular/router";
import { parseWindowHash } from "../../helpers/parseWindowHash";
import { ImplicitGrantFlowResponse } from "../../models/ImplicitGrantFlowResponse";
import { FitbitAccountService } from "src/app/services/fitbit-account.service";
import { FitbitAccount } from "src/app/models/FitbitAccount";

@Component({
  selector: "admin",
  templateUrl: "admin.component.html",
  styleUrls: ["admin.component.scss"]
})
export class AdminComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  currentUser;

  users: any = {};
  clientAccounts: any = {};

  constructor(
    private authenticationService: AuthenticationService,
    private fitbitAccountService: FitbitAccountService,
    private clientAccountService: ClientAccountService,
    private userService: UserService,
    private fitbitService: FitbitService,
    private router: Router
  ) {
    const sub = this.authenticationService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.subscriptions.push(sub);
  }

  ngOnInit() {
    console.log(window.location);

    const hash = window.location.hash;
    const search = window.location.search;

    if (hash !== "") {
      if (search.includes("error") || search.includes("error_description")) {
        this.router.navigate([""]);
      } else if (hash.includes("access_token")) {
        const implicitGrantFlowResponse = parseWindowHash<
          ImplicitGrantFlowResponse
        >(hash);

        const sub = this.fitbitAccountService
          .patch(this.fitbitService.tempFitbitAccountID, {
            encoded_id: implicitGrantFlowResponse.user_id,
            access_token: implicitGrantFlowResponse.access_token
          })
          .subscribe(
            () => {
              //on success, we remove tempFitbitAccountID from local storage since it's not needed anymore
              this.fitbitService.tempFitbitAccountID = null;
              window.location.hash = "";
              // window.location.search = "";
            },
            error => {
              console.log(error);
            }
          );

        this.subscriptions.push(sub);
      }
    }

    this.loadUsers();
    this.loadClientAccounts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  unlinkFromClientAccount(params) {
    const sub = this.userService
      .unlinkFromClientAccount(params.userID, params.clientAccountID)
      .subscribe(response => {
        response = response["rows"][0];
        if (response) {
          const indexOf = this.users[params.userID].client_account_ids.indexOf(
            params.clientAccountID
          );

          this.users[params.userID].client_account_ids.splice(indexOf, 1);
        }
      });

    this.subscriptions.push(sub);
  }

  linkToClientAccount({ userID, clientAccountsIDs }) {
    const sub = this.userService
      .linkToClientAccount(userID, clientAccountsIDs)
      .subscribe(response => {
        response = response["rows"];
        if (response) {
          response.forEach(row => {
            const { user_id, client_account_id } = row;
            this.users[user_id].client_account_ids.push(client_account_id);
          });
        }
      });

    this.subscriptions.push(sub);
  }

  private loadUsers() {
    const sub = this.userService.get().subscribe(users => {
      console.log(users);

      this.users = users.reduce((acc, user) => {
        acc[user.id] = user;

        return acc;
      }, {});

      console.log(this.users);
    });

    this.subscriptions.push(sub);
  }

  private loadClientAccounts() {
    const sub = this.clientAccountService.get().subscribe(clientAccounts => {
      for (const clientAccount of clientAccounts) {
        this.clientAccounts[clientAccount.id] = clientAccount;
      }
      console.log(this.clientAccounts);
    });

    this.subscriptions.push(sub);
  }

  deleteUser(id: number) {
    const sub = this.userService.delete(id).subscribe(response => {
      const deletedID = response.id;
      delete this.users[deletedID];
    });

    this.subscriptions.push(sub);
  }

  deleteFitbitAccount(id: number) {
    const sub = this.clientAccountService.delete(id).subscribe(response => {
      const deletedID = response.id;
      delete this.clientAccounts[deletedID];

      Object.values<any>(this.users).forEach(user => {
        const indexOf = user.client_account_ids.indexOf(deletedID);

        user.client_account_ids.splice(indexOf, 1);
        console.log(deletedID, indexOf, user.client_account_ids);
      });
    });

    this.subscriptions.push(sub);
  }

  refreshAccessToken(fitbitAccount) {
    this.fitbitService.requestAccess(fitbitAccount);
  }

  revokeAccessToken(fitbitAccount: FitbitAccount) {
    const sub = this.fitbitService
      .relinquishAccess(fitbitAccount.id)
      .subscribe(response => {
        console.log(response, "revoked");
      });

    this.subscriptions.push(sub);
  }
}
