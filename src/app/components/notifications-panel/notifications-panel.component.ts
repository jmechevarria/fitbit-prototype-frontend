import * as moment from "moment";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, forkJoin, Observable } from "rxjs";
import { filter, switchMap, tap, map } from "rxjs/operators";

import { AuthenticationService } from "src/app/services/authentication.service";
import { ConfirmationDialogComponent } from "src/app/widgets/components/confirmation-dialog/confirmation-dialog.component";
import { DialogService } from "src/app/services/dialog.service";
import { FitbitService } from "src/app/services/fitbit.service";
import { SubscriptionNotificationService } from "src/app/services/subscription.notification.service";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "notifications-panel",
  templateUrl: "./notifications-panel.component.html",
  styleUrls: ["./notifications-panel.component.scss"]
})
export class NotificationsPanelComponent implements OnInit, OnDestroy {
  pushMessages$;
  notifications: any[] = [];
  subscriptions: Subscription[] = [];
  ICONS = {
    warning: "exclamation-triangle"
  };
  notifications$: Observable<any[]>;

  constructor(
    private subscriptionNotificationService: SubscriptionNotificationService,
    private authenticationService: AuthenticationService,
    private fitbitService: FitbitService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private userService: UserService
  ) {
    try {
      const sub$ = this.subscriptionNotificationService
        .fetchFromDB(this.authenticationService.currentUser.data.id, 20, {
          from: moment()
            .subtract(1, "d")
            .format("YYYY-MM-DD HH:mm:ss.SSSZ"),
          to: moment().format("YYYY-MM-DD HH:mm:ss.SSSZ")
        })
        .subscribe(notifications => {
          this.notifications = notifications.map(notification => {
            notification.localeFormat = moment(notification.created_utc).format(
              "LLL"
            );

            const accidentProbability = JSON.parse(notification.payload)
              .accident_probability;

            let message = "notifications_panel.";

            if (accidentProbability > 0.9) message += "very_high";
            else if (accidentProbability > 0.8) message += "high";
            else message += "moderate";

            notification.senior_person.fullname = `${
              notification.senior_person.firstname
            } ${notification.senior_person.lastname}
             ${
               notification.senior_person.lastname2
                 ? notification.senior_person.lastname2
                 : ""
             }`;

            return { ...notification, message };
          });
          console.log(this.notifications);
        });

      this.subscriptions.push(sub$);
    } catch (error) {
      console.log(error.toString());
    }

    // pushNotificationService.getMessages().subscribe(notification => {
    // const sub$ = subscriptionNotificationService.notifications$.subscribe(
    //   notification => {
    //     this.notifications.unshift(notification);
    //     console.log(
    //       "22222222222222222222222222222",
    //       JSON.stringify(notification)
    //     );
    //   }
    // );
    // this.subscriptions.push(sub$);
  }

  ngOnInit() {
    const sub$ = this.subscriptionNotificationService.notifications$
      .pipe(
        map(notifications =>
          notifications.map(notification => {
            console.log("init processNotification", notification);
            const localeFormat = moment(notification.created).format("LLL");

            const accidentProbability =
              notification.payload.accident_probability;

            let message = "notifications_panel.";
            if (accidentProbability > 0.9) message += "very_high";
            else if (accidentProbability > 0.8) message += "high";
            else message += "moderate";

            return { ...notification, message, localeFormat };
          })
        )
      )
      .subscribe(notifications => {
        this.notifications.unshift(notifications[0]);
      });

    this.subscriptions.push(sub$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // private processNotification(notification) {
  //   console.log("init processNotification", notification);
  //   const createdAt = moment(notification.created_utc).format("LLL");
  //   let message = "";

  //   const accidentProbability = notification.payload.accident_probability;
  //   if (accidentProbability > 0.8) message = "Accident probability: HIGH";
  //   else if (accidentProbability > 0.9)
  //     message = "Accident probability: VERY HIGH";
  //   else {
  //     message = "Accident probability: MODERATE";
  //   }
  //   console.log("end processNotification", {
  //     ...notification,
  //     message,
  //     created: createdAt
  //   });

  //   return { ...notification, message, created: createdAt };
  // }

  toggleRead(notification) {
    notification.read = !notification.read;

    this.subscriptionNotificationService
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

  viewIncidentDetails(notification) {
    this.fitbitService
      .fetchIncidents([notification.incident_id], notification.senior_person.id)
      .subscribe(res => {
        console.log(res);
      });
  }

  getContacts(senior_person, notification) {
    this.userService.getContacts(senior_person).subscribe(contacts => {
      this.showEmailConfirmationModal(contacts, notification);
    });
  }

  private showEmailConfirmationModal(contacts, notification) {
    const title$ = this.translate.get("notifications_panel.dialog.title");
    const body$ = this.translate.get(
      "notifications_panel.dialog.email_confirmation.body",
      {
        emails: `${contacts
          .filter(contact => contact.receive_emails)
          .map(contact => {
            return `<b>${contact.email}</b>`;
          })
          .join(",")}`
      }
    );

    forkJoin([title$, body$])
      .pipe(
        switchMap(([titleContent, bodyContent]) => {
          const body = `<p class='mat-h4'>${bodyContent}</p>`;

          const dialogRef = this.dialogService.customDialogComponent(
            ConfirmationDialogComponent,
            {
              data: {
                title: titleContent,
                body
              }
            }
          );

          return dialogRef.afterClosed();
        }),
        filter(confirm => {
          console.log(confirm);

          return confirm;
        }),
        tap(() => {
          this.subscriptionNotificationService
            .sendEmail(
              contacts
                .filter(contact => contact.receive_emails)
                .map(contact => {
                  return contact.email;
                }),
              "Posible incidente",
              `El sistema ha detectado anomalías en el estado general de salud de ${notification.senior_person.fullname}`
            )
            .subscribe(
              response => {
                console.log("show toast email sent successfully");
              },
              error => {
                console.log("show toast email sent failed");
              }
            );
        })
      )
      .subscribe();
    console.log(contacts);
  }
}
