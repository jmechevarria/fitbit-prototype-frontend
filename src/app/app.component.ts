import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FitbitService } from "./services/fitbit.service";
import { User } from "./models/User";
import { AuthenticationService } from "./services/authentication.service";
import { DateAdapter } from "@angular/material/core";
import { TranslateService } from "@ngx-translate/core";

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
    private adapter: DateAdapter<any>,
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
    if (!locale) locale = localStorage.getItem("locale") || "en-US";
    localStorage.setItem("locale", locale);
    this.adapter.setLocale(locale); //for date picker
    this.translate.use(locale); //whole site
  }

  profiletest() {
    this.fitbitService.getUserProfile().subscribe(response => {
      console.log(response);
    });
  }
}
