import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./models/User";
import { AuthenticationService } from "./services/authentication.service";
import { DateAdapter } from "@angular/material/core";
import { TranslateService } from "@ngx-translate/core";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { PushNotificationService } from "./services/push-notification.service";
import { MatSnackBar } from "@angular/material";

const VAPID_PUBLIC =
  "BCLqXPqZe-QWv8hQ-2RR9g5VKrhJnGHiM0PN0hs-xgka4inF2ylT5sjWd-8fyGT2OC1xagNR4D0SqgbDPjH8VD0";
// "privateKey":"OkNDVpMzXz7CW_G7s07hxsogeh2XeJiOoogWfBLQRxw"
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
    private adapter: DateAdapter<any>,
    private translate: TranslateService,
    matSnackBar: MatSnackBar,
    swPush: SwPush,
    swUpdate: SwUpdate,
    pushNotificationService: PushNotificationService
  ) {
    if (swPush.isEnabled) {
      swPush
        .requestSubscription({
          serverPublicKey: VAPID_PUBLIC
        })
        .then(subscription => {
          // send subscription to the server
          console.log("subscription object generated: ", subscription);
          pushNotificationService
            .sendSubscriptionToTheServer(subscription)
            .subscribe();
        })
        .catch(console.error);

      swUpdate.available.subscribe(update => {
        matSnackBar
          .open("Update Avaiblable", "Reload")
          .onAction()
          .subscribe(() => {
            window.location.reload();
          });
      });

      swPush.messages.subscribe(msg => {
        console.log(JSON.stringify(msg));
        matSnackBar.open(
          `${JSON.stringify(msg["notification"])} 🔔`,
          "Cerrar",
          {
            duration: 2000
          }
        );
      });
    }

    console.log("out");

    this.authenticationService.currentUser$.subscribe(user => {
      this.currentUser = user;
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
}
