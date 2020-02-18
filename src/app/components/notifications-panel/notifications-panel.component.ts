import { Component, OnInit } from "@angular/core";
import { PushNotificationService } from "src/app/services/push-notification.service";
import { MatSnackBar } from "@angular/material";
import * as moment from "moment";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitAccountService } from "src/app/services/fitbit-account.service";
import { FitbitService } from "src/app/services/fitbit.service";

@Component({
  selector: "notifications-panel",
  templateUrl: "./notifications-panel.component.html",
  styleUrls: ["./notifications-panel.component.scss"]
})
export class NotificationsPanelComponent implements OnInit {
  pushMessages$;
  notifications: any[] = [];
  ICONS = {
    warning: "exclamation-triangle"
  };

  // ACCIDENT_PROBABILITIES = {
  //   HIGH:
  // };

  constructor(
    private pushNotificationService: PushNotificationService,
    private authenticationService: AuthenticationService,
    private fitbitService: FitbitService
  ) {
    try {
      console.log(moment().format(), moment().unix(), moment());

      this.pushNotificationService
        .fetchFromDB(this.authenticationService.currentUser.data.id, 20, {
          to: moment().format("YYYY-MM-DD HH:mm:ss.SSSZ")
        })
        .subscribe(notifications => {
          this.notifications = Object.values(notifications).map(
            notification => {
              notification.created = moment(notification.created_utc).format(
                "LLL"
              );

              console.log(notification.payload);
              console.log(notification.payload.constructor);

              const accidentProbability = JSON.parse(notification.payload)
                .accident_probability;
              if (accidentProbability > 0.8)
                notification.message = "Accident probability: HIGH";
              else if (accidentProbability > 0.9)
                notification.message = "Accident probability: VERY HIGH";
              else notification.message = "Accident probability: MODERATE";

              return notification;
            }
          );
          // console.log(this.notifications);
        });
    } catch (error) {
      console.log(error.toString());
    }

    pushNotificationService.getMessages().subscribe(notification => {
      this.notifications.push(notification);
      console.log(JSON.stringify(notification));
    });
  }

  ngOnInit() {
    this.pushMessages$ = this.pushNotificationService.getMessages();
  }

  toggleRead(notification) {
    notification.read = !notification.read;

    this.pushNotificationService
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
        }
      );
  }

  viewIncidentData(notification) {
    this.fitbitService
      .fetchIncidents([notification.incident_id], notification.senior_person_id)
      .subscribe(res => {
        console.log(res);
      });
  }
}
