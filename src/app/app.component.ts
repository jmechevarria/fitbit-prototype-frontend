import "moment/min/locales";

import * as moment from "moment";

import { Observable, Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { map } from "rxjs/operators";

import { AuthenticationService } from "./services/authentication.service";
import { DateAdapter } from "@angular/material/core";
import { SubscriptionNotificationService } from "./services/subscription.notification.service";
import { TranslateService } from "@ngx-translate/core";
import { IUser } from "./models/IUser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = "fitbit-app-proto";

  notifications$: Observable<any[]>;

  messagesSubscription: Subscription;
  newNotifications: boolean = false;
  audio;
  currentUser: IUser;

  private subscriptions: Subscription[] = [];
  constructor(
    private authenticationService: AuthenticationService,
    private adapter: DateAdapter<any>,
    private translate: TranslateService,
    private subscriptionNotificationService: SubscriptionNotificationService
  ) {
    translate.setDefaultLang("en-US");
  }

  ngOnInit(): void {
    this.setLocale();

    this.notifications$ = this.subscriptionNotificationService.notifications$.pipe(
      // map(notifications => notifications.map(n => this.processNotification(n)))
      map(notifications =>
        notifications.map(notification => {
          console.log("init processNotification", notification);
          // const localeFormat = moment(notification.created).format("LLL");
          const clientAccountFullname = `${
            notification.client_account.firstname
          } ${notification.client_account.lastname}${
            notification.client_account.lastname2
              ? ` ${notification.client_account.lastname2}`
              : ""
          }`;

          // const accidentProbability = notification.payload.accident_probability;

          // let message = "notifications_panel.";

          // if (accidentProbability > 0.9) message += "very_high";
          // else if (accidentProbability > 0.8) message += "high";
          // else message += "moderate";

          this.newNotifications = true;

          return { ...notification, clientAccountFullname };
          // return { ...notification, message, localeFormat };
        })
      )
    );

    const sub = this.authenticationService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.subscriptionNotificationService.subscribeToPN();
      }
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // playAudio() {
  //   this.audio = new Audio();
  //   this.audio.src = "../assets/sounds/notification.mp3";
  //   this.audio.load();
  //   this.audio.play();
  // }

  get isAuthenticated() {
    return this.authenticationService.isAuthenticated;
  }

  logout() {
    this.authenticationService.logout();
  }

  setLocale(locale?: string) {
    if (!locale) locale = localStorage.getItem("locale") || "en-US";
    localStorage.setItem("locale", locale);
    this.adapter.setLocale(locale); //for matDatepicker's
    moment.locale(locale); // for moment.js
    this.translate.use(locale); //whole site
  }

  unsubscribe() {
    this.subscriptionNotificationService.unsubscribeFromPN();
  }
}
