import { Component, OnInit } from "@angular/core";
import { parseWindowHash } from "./helper";
import { ImplicitGrantFlowResponse } from "./models/ImplicitGrantFlowResponse";
import { Router } from "@angular/router";
import { FitbitService } from "./services/fitbit.service";
import { User } from "./models/User";
import { AuthenticationService } from "./services/authentication.service";
import { Locale } from "moment";
import { DateAdapter } from "@angular/material/core";

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
    private fitbitService: FitbitService,
    private adapter: DateAdapter<any>
  ) {
    this.authenticationService.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    if (window.location.hash !== "") {
      if (window.location.search.includes("error") || window.location.search.includes("error_description")) {
        this.router.navigate([""]);
      } else if (window.location.hash.includes("access_token")) {
        const implicitGrantFlowResponse = parseWindowHash<ImplicitGrantFlowResponse>(window.location.hash);

        this.fitbitService.accessToken = implicitGrantFlowResponse.access_token;
        this.fitbitService.fitbitUserID = implicitGrantFlowResponse.user_id;
      }

      window.location.hash = "";
      window.location.search = "";
    }

    this.setLocale();
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

  setLocale(locale?: string) {
    if (!locale) locale = localStorage.getItem("locale");
    this.adapter.setLocale(locale);
    localStorage.setItem("locale", locale);
  }
}
