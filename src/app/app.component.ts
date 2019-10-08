import { Component, OnInit } from "@angular/core";
// import { parseWindowHash } from "./helper";
import { ImplicitGrantFlowResponse } from "./models/ImplicitGrantFlowResponse";
import { Router } from "@angular/router";
import { FitbitService } from "./services/fitbit.service";
import { User } from "./models/User";
import { AuthenticationService } from "./services/authentication.service";
import { Locale } from "moment";
import { DateAdapter } from "@angular/material/core";
import { FitbitAppService } from "./services/fitbit-app.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title: string = "fitbit-app-proto";

  currentUser: User;
  // param = { value: "world" };
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private fitbitService: FitbitService,
    private adapter: DateAdapter<any>,
    private fitbitAppService: FitbitAppService,
    private translate: TranslateService
  ) {
    this.authenticationService.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
    translate.setDefaultLang("en-US");
  }

  ngOnInit(): void {
    this.setLocale();
  }

  get isAuthenticated() {
    return this.authenticationService.isAuthenticated;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate([""]);
  }

  setLocale(locale?: string) {
    if (!locale) locale = localStorage.getItem("locale");
    this.adapter.setLocale(locale);
    localStorage.setItem("locale", locale);
    this.translate.use(localStorage.getItem("locale"));
  }

  profiletest() {
    this.fitbitService.getUserProfile().subscribe(response => {
      console.log(response);
    });
  }
}
