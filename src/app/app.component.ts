import { Component, OnInit } from "@angular/core";
import { parseWindowHash } from "./helper";
import { ImplicitGrantFlowResponse } from "./models/ImplicitGrantFlowResponse";
import { Router } from "@angular/router";
import { FitbitService } from "./services/fitbit.service";
import { User } from "./models/user";
import { AuthenticationService } from "./services/authentication.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title: string = "fitbit-app-proto";

  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private fitbitService: FitbitService
  ) {
    this.authenticationService.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    if (window.location.hash !== "") {
      console.log(window.location);
      if (window.location.search.includes("error") || window.location.search.includes("error_description")) {
        console.log("if");
        // window.location.search = "";
        // this.router.navigate([""]);
      } else if (window.location.hash.includes("access_token")) {
        const implicitGrantFlowResponse = parseWindowHash<ImplicitGrantFlowResponse>(window.location.hash);

        this.fitbitService.accessToken = implicitGrantFlowResponse.access_token;
        this.fitbitService.userID = implicitGrantFlowResponse.user_id;
      }
      // window.location.hash = "";
      window.location.href = window.location.origin + window.location.pathname;
    }
  }

  get isAuthenticated() {
    return this.authenticationService.isAuthenticated;
  }

  get appHasAccess() {
    return this.fitbitService.appHasAccess();
  }

  logout() {
    this.fitbitService.relinquishAccess().subscribe(() => {
      this.authenticationService.logout();
      this.router.navigate([""]);
    });
  }
}
