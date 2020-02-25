import { Subscription } from "rxjs";
import { Component, Input, OnChanges, OnDestroy, OnInit } from "@angular/core";

import { FitbitService } from "src/app/services/fitbit.service";
import { SubscriptionNotificationService } from "src/app/services/subscription.notification.service";

@Component({
  selector: "notifications-dropdown",
  templateUrl: "./notifications-dropdown.component.html",
  styleUrls: ["./notifications-dropdown.component.scss"]
})
export class NotificationsDropdownComponent
  implements OnInit, OnChanges, OnDestroy {
  ICONS = {
    warning: "exclamation-triangle"
  };

  unread: number = 0;
  // showCounter: boolean = false;

  private subscriptions: Subscription[] = [];

  @Input()
  notifications: any[];

  @Input()
  showCounter: boolean;

  constructor(
    private subscriptionNotificationService: SubscriptionNotificationService,
    private fitbitService: FitbitService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    console.log("notif dropdown", this.notifications);

    // if (this.notifications && this.notifications.length) {
    //   this.showCounter = true;
    // }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s$ => s$.unsubscribe());
  }

  toggleRead(notification) {
    notification.read = !notification.read;
    console.log(notification.read, notification.id);

    const sub$ = this.subscriptionNotificationService
      .update(
        { read: notification.read },
        {
          id: notification.id
        }
      )
      .subscribe(
        response => {
          if (response) console.log(response);
        },
        error => {
          notification.read = !notification.read;
          this.unread;
        }
      );

    this.subscriptions.push(sub$);
  }

  viewIncidentData(notification) {
    const sub$ = this.fitbitService
      .fetchIncidents([notification.incident_id], notification.senior_person.id)
      .subscribe(res => {
        console.log(res);
      });

    this.subscriptions.push(sub$);
  }
}
