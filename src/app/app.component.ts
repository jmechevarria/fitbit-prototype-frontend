import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "./models/User";
import { AuthenticationService } from "./services/authentication.service";
import { DateAdapter } from "@angular/material/core";
import { TranslateService } from "@ngx-translate/core";
import { PushNotificationService } from "./services/push-notification.service";
import * as moment from "moment";
import "moment/min/locales";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = "fitbit-app-proto";
  notifications: any[] = []; //this is for usage within this component
  private _notificationsSubject: BehaviorSubject<any[]>; //this is to be updated everytime 'notifications' changes
  notifications$: Observable<any[]>; //this is to be "observed" by other components who need 'notifications'

  pushMessages$;

  currentUser: User;
  MENU_ITEMS_IDENTIFIERS = {
    HOME: "HOME",
    DASHBOARD: "DASHBOARD",
    ADMINISTRATION: "ADMINISTRATION"
  };

  activeItem: string;
  mobile: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private adapter: DateAdapter<any>,
    private translate: TranslateService,
    private pushNotificationService: PushNotificationService
  ) {
    translate.setDefaultLang("en-US");
    this.pushMessages$ = this.pushNotificationService.getMessages();
    this._notificationsSubject = new BehaviorSubject<any[]>([]);
    this.notifications$ = this._notificationsSubject.asObservable();
  }

  ngOnInit(): void {
    this.setLocale();
    this.authenticationService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        //fetch unread notifications from the db
        try {
          console.log(moment().format(), moment().unix(), moment());

          this.pushNotificationService
            .fetchFromDB(
              this.currentUser.data.id,
              5,

              { to: moment().format("YYYY-MM-DD HH:mm:ss.SSSZ") }
            )
            .subscribe(notifications => {
              this.notifications = Object.values(notifications);
              this._notificationsSubject.next(this.notifications);

              console.log(this.notifications);
            });
        } catch (error) {
          console.log(error.toString());
        }

        this.pushNotificationService.subscribeToPN();
        this.pushMessages$.subscribe(notification => {
          this.notifications.push(notification);
          // console.log(this.notifications);
          this._notificationsSubject.next(this.notifications);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.pushMessages$.unsubscribe();
  }

  get isAuthenticated() {
    return !!this.currentUser;
    return this.authenticationService.isAuthenticated;
  }

  logout() {
    this.authenticationService.logout();
  }

  setLocale(locale?: string) {
    if (!locale) locale = localStorage.getItem("locale") || "en-US";
    localStorage.setItem("locale", locale);
    this.adapter.setLocale(locale); //for date picker
    moment.locale(locale); // for moment.js
    this.translate.use(locale); //whole site
  }

  unsubscribe() {
    this.pushNotificationService.unsubscribeFromPN();
  }

  setActiveItem(itemIdentifier: string) {
    this.activeItem = itemIdentifier;
  }
}
