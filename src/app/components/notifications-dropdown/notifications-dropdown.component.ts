import { Subscription } from "rxjs";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { SubscriptionNotificationService } from "src/app/services/subscription.notification.service";

@Component({
  selector: "notifications-dropdown",
  templateUrl: "./notifications-dropdown.component.html",
  styleUrls: ["./notifications-dropdown.component.scss"],
})
export class NotificationsDropdownComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  ICONS = {
    warning: "exclamation-triangle",
  };

  unread: number = 0;

  @Input()
  notifications: any[];

  @Input()
  newNotifications: boolean;

  constructor(
    private subscriptionNotificationService: SubscriptionNotificationService // private fitbitService: FitbitService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  toggleRead(notification) {
    notification.read = !notification.read;
    console.log(notification.read, notification.id);

    const sub = this.subscriptionNotificationService
      .toggleRead(notification)
      .subscribe(
        (response) => {
          if (response) console.log(response);
        },
        () => {
          notification.read = !notification.read;
          this.unread;
        }
      );

    this.subscriptions.push(sub);
  }
}
