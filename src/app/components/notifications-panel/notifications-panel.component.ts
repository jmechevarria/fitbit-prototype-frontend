import * as moment from "moment";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitService } from "src/app/services/fitbit.service";
import { SubscriptionNotificationService } from "src/app/services/subscription.notification.service";
import { IncidentDetailsDialogComponent } from "./incident-details-dialog/incident-details-dialog.component";
import { MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { IncidentService } from "src/app/services/incident.service";

@Component({
  selector: "notifications-panel",
  templateUrl: "./notifications-panel.component.html",
  styleUrls: ["./notifications-panel.component.scss"],
})
export class NotificationsPanelComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  modalRef: MDBModalRef;
  pushMessages$;
  notifications: any[] = [];
  ICONS = {
    warning: "exclamation-triangle",
    danger: "exclamation-circle",
  };
  notifications$: Observable<any[]>;
  private dialogContentSubject: BehaviorSubject<{}>;
  dialogContent: Observable<{}>;

  constructor(
    private subscriptionNotificationService: SubscriptionNotificationService,
    private authenticationService: AuthenticationService,
    private incidentService: IncidentService,
    private mDBModalService: MDBModalService
  ) {
    this.dialogContentSubject = new BehaviorSubject<{}>({});
    this.dialogContent = this.dialogContentSubject.asObservable();

    try {
      const sub = this.subscriptionNotificationService
        .fetchFromDB(this.authenticationService.currentUser.id, {
          // from: moment().subtract(1, "d").format("YYYY-MM-DD HH:mm:ss.SSSZ"),
          // to: moment().format("YYYY-MM-DD HH:mm:ss.SSSZ"),
          limit: 20,
        })
        .subscribe((notifications) => {
          this.notifications = notifications.map((notification) => {
            // notification.localeFormat = moment(notification.created_utc).format(
            //   "LLL"
            // );

            // const accidentProbability = JSON.parse(notification.payload)
            //   .accident_probability;

            // let message = "notifications_panel.";

            // if (accidentProbability > 0.9) message += "very_high";
            // else if (accidentProbability > 0.8) message += "high";
            // else message += "moderate";

            // notification.client_account.fullname = `${
            //   notification.client_account.firstname
            // } ${notification.client_account.lastname}
            //  ${
            //    notification.client_account.lastname2
            //      ? notification.client_account.lastname2
            //      : ""
            //  }`;
            // const localeFormat = moment(notification.created).format("LLL");
            const clientAccountFullname = `${
              notification.client_account.firstname
            } ${notification.client_account.lastname}${
              notification.client_account.lastname2
                ? ` ${notification.client_account.lastname2}`
                : ""
            }`;

            return { ...notification, clientAccountFullname };

            // return { ...notification, message };
          });
          // console.log(this.notifications);
        });

      this.subscriptions.push(sub);
    } catch (error) {
      console.log(error);
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
    const sub = this.subscriptionNotificationService.notifications$
      .pipe(
        map((notifications) =>
          notifications.map((notification) => {
            console.log("init processNotification", notification);
            // const localeFormat = moment(notification.created).format("LLL");

            // const accidentProbability =
            //   notification.payload.accident_probability;

            // let message = "notifications_panel.";
            // if (accidentProbability > 0.9) message += "very_high";
            // else if (accidentProbability > 0.8) message += "high";
            // else message += "moderate";

            // return { ...notification, message, localeFormat };
            // const localeFormat = moment(notification.created).format("LLL");
            const clientAccountFullname = `${
              notification.client_account.firstname
            } ${notification.client_account.lastname}${
              notification.client_account.lastname2
                ? ` ${notification.client_account.lastname2}`
                : ""
            }`;

            return { ...notification, clientAccountFullname };
          })
        )
      )
      .subscribe((notifications) => {
        if (notifications[0]) this.notifications.unshift(notifications[0]);
      });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
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

    const sub = this.subscriptionNotificationService
      .toggleRead(notification)
      .subscribe(
        (response) => {
          if (response) console.log(response);
        },
        () => {
          notification.read = !notification.read;
        }
      );

    this.subscriptions.push(sub);
  }

  markAccident(notification) {
    notification.read = !notification.read;

    const sub = this.subscriptionNotificationService
      .toggleRead(notification)
      .subscribe(
        (response) => {
          if (response) console.log(response);
        },
        () => {
          notification.read = !notification.read;
        }
      );

    this.subscriptions.push(sub);
  }

  viewIncidentDetails(notification) {
    this.modalRef = this.mDBModalService.show(IncidentDetailsDialogComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      ignoreBackdropClick: false,
      animated: true,
      class: "modal-dialog-scrollable incident-details-dialog", //incident-details-dialog class is used in styles.scss
      data: {
        title: "notifications_panel.dialog.incident_details.title",
        header: [],
      },
    });

    // const sub = this.fitbitService
    //   .fetchIncidents(notification.incident)
    const sub = this.incidentService
      .get(notification.incident)
      .subscribe((incidents) => {
        const incident = incidents[0];
        console.log(incident);

        if (incident) {
          // this.modalRef.content.content = {};
          let auxContent = {
            timestamp: undefined,
            wearable_states: undefined,
            header: undefined,
            picture: undefined,
          };

          // console.log(this.modalRef.content.content);

          // this.modalRef.content._content.timestamp = moment(incident.timestamp);
          auxContent.timestamp = moment(incident.created + "Z");

          const wearable_states = incident.wearable_states;
          if (wearable_states && wearable_states.length) {
            // this.modalRef.content._content.wearable_states = wearable_states;
            auxContent.wearable_states = wearable_states;

            // this.modalRef.content.header = Object.keys(wearable_states[0]).map(
            auxContent.header = Object.keys(wearable_states[0]).map(
              (elem) => `shared.${elem}`
            );
          }

          const picture = incident.picture;

          // if (picture) this.modalRef.content._content.picture = picture;
          if (picture) auxContent.picture = picture;

          this.modalRef.content.content = auxContent;
          this.modalRef.content.loading = false;

          this.dialogContentSubject.next(this.modalRef.content);
          // console.log(res, this.modalRef.content);
        }
      });

    this.subscriptions.push(sub);
  }

  // getContacts(client_account, notification) {
  //   const sub = this.userService
  //     .getContacts(client_account)
  //     .subscribe(contacts => {
  //       this.showEmailConfirmationModal(contacts, notification);
  //     });

  //   this.subscriptions.push(sub);
  // }

  // private showEmailConfirmationModal(contacts, notification) {
  //   const title$ = this.translate.get("notifications_panel.dialog.title");
  //   const body$ = this.translate.get(
  //     "notifications_panel.dialog.email_confirmation.body",
  //     {
  //       emails: `${contacts
  //         .filter(contact => contact.receive_emails)
  //         .map(contact => {
  //           return `<b>${contact.email}</b>`;
  //         })
  //         .join(",")}`
  //     }
  //   );

  //   forkJoin([title$, body$])
  //     .pipe(
  //       switchMap(([titleContent, bodyContent]) => {
  //         const body = `<p class='mat-h4'>${bodyContent}</p>`;

  //         const dialogRef = this.dialogService.customDialogComponent(
  //           ConfirmationDialogComponent,
  //           {
  //             data: {
  //               title: titleContent,
  //               body
  //             }
  //           }
  //         );

  //         return dialogRef.afterClosed();
  //       }),
  //       filter(confirm => {
  //         console.log(confirm);

  //         return confirm;
  //       }),
  //       tap(() => {
  //         this.subscriptionNotificationService
  //           .sendEmail(
  //             contacts
  //               .filter(contact => contact.receive_emails)
  //               .map(contact => {
  //                 return contact.email;
  //               }),
  //             "Posible incidente",
  //             `El sistema ha detectado anomalías en el estado general de salud de ${notification.client_account.fullname}`
  //           )
  //           .subscribe(
  //             response => {
  //               console.log("show toast email sent successfully");
  //             },
  //             error => {
  //               console.log("show toast email sent failed");
  //             }
  //           );
  //       })
  //     )
  //     .subscribe();
  //   console.log(contacts);
  // }
}
