import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "notifications-dropdown",
  templateUrl: "./notifications-dropdown.component.html",
  styleUrls: ["./notifications-dropdown.component.scss"]
})
export class NotificationComponent implements OnInit, OnChanges {
  ICONS = {
    warning: "exclamation-triangle"
  };

  private _notifications$: Observable<any[]>;
  notifications: any[];

  @Input()
  set notifications$(notifications: Observable<any[]>) {
    // this._notificationsSubject.next(notifications);
    this._notifications$ = notifications;
    this._notifications$.subscribe(x => {
      this.notifications = x;
      this.unread = this.notifications.filter(n => !n.read).length;
    });
    // this.read = this._notificationsSubject
    //   .getValue()
    console.log(this.unread);
  }

  get notifications$() {
    return this._notifications$;
  }

  unread: number = 0;
  constructor() {
    // this._notificationsSubject = new BehaviorSubject<any[]>(this.notifications);
    // this.notifications$ = this._notificationsSubject.asObservable();
    console.log(this.notifications);
  }

  ngOnInit() {
    // this._notificationsSubject.subscribe();
    // console.log(this.notifications);
    // this.read = this.notifications.filter(n => n.read).length;
  }

  ngOnChanges() {
    // this._notifications.subscribe(x => {
    //   this.notifications = x;
    //   console.log(this.notifications);
    // });
    // console.log(this.notifications);
    // this.read = this.notifications.filter(n => n.read).length;
  }
}
