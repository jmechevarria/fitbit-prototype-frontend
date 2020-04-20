import * as moment from "moment";
import { Component, OnInit } from "@angular/core";
import { MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { Subscription, Observable } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FitbitService } from "src/app/services/fitbit.service";
import { IncidentService } from "src/app/services/incident.service";
import { IncidentDetailsDialogComponent } from "../notifications-panel/incident-details-dialog/incident-details-dialog.component";

@Component({
  selector: "incidents-panel",
  templateUrl: "./incidents-panel.component.html",
  styleUrls: ["./incidents-panel.component.scss"],
})
export class IncidentsPanelComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  modalRef: MDBModalRef;
  pushMessages$;
  incidents: any[] = [];
  ICONS = {
    warning: "exclamation-triangle",
    danger: "exclamation-circle",
  };
  notifications$: Observable<any[]>;
  // private dialogContentSubject: BehaviorSubject<{}>;
  // dialogContent: Observable<{}>;

  constructor(
    private authenticationService: AuthenticationService,
    private fitbitService: FitbitService,
    private mDBModalService: MDBModalService,
    private incidentService: IncidentService
  ) {
    // this.dialogContentSubject = new BehaviorSubject<{}>({});
    // this.dialogContent = this.dialogContentSubject.asObservable();

    try {
      const sub = this.incidentService
        .search({
          // from: moment().subtract(1, "d").format("YYYY-MM-DD HH:mm:ss.SSSZ"),
          // to: moment().format("YYYY-MM-DD HH:mm:ss.SSSZ"),
          limit: 20,
        })
        .subscribe((incidents) => {
          this.incidents = incidents.map((incident) => {
            const clientAccountFullname = `${
              incident.client_account.firstname
            } ${incident.client_account.lastname}${
              incident.client_account.lastname2
                ? ` ${incident.client_account.lastname2}`
                : ""
            }`;
            return { ...incident, clientAccountFullname };
          });
        });
      this.subscriptions.push(sub);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // processIncident(event, incident, accident: boolean) {
  //   console.log(event.target.value, incident);

  //   // if (incident.processed) {
  //   //   //toast already processed
  //   // } else
  //   if (event.target.value !== undefined) {
  //     const sub = this.incidentService
  //       .processIncident({ ...incident, actual_accident: event.target.value })
  //       .subscribe((response) => {
  //         if (response) console.log(response);
  //         // incident = response;
  //         incident.actual_accident = event.target.value;
  //         incident.processed = true;
  //       });
  //     this.subscriptions.push(sub);
  //   }
  // }
  processIncident(incident, accident: boolean) {
    console.log(incident, accident);

    // if (incident.processed) {
    //   //toast already processed
    // } else
    // if (event.target.value !== undefined) {
    const sub = this.incidentService
      .processIncident({ ...incident, actual_accident: accident })
      .subscribe((response) => {
        if (response) console.log(response);
        // incident = response;
        incident.actual_accident = accident;
        incident.processed = true;
      });
    this.subscriptions.push(sub);
    // }
  }

  viewIncidentDetails(event, incident) {
    // // if (event.currentTarget.classList.contains("incident")) {
    // console.log(event.target, event.currentTarget);
    // console.log(event.target.tagName, event.currentTarget.tagName);
    if (event.target.tagName == "TD") {
      this.modalRef = this.mDBModalService.show(
        IncidentDetailsDialogComponent,
        {
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
        }
      );

      // const sub = this.fitbitService
      //   .fetchIncidents(incident.id)
      const sub = this.incidentService
        .get(incident.id)
        .subscribe((incident) => {
          // const incident = incidents[0];
          console.log(incident);

          if (incident) {
            // this.modalRef.content.content = {};
            // let auxContent = {
            //   timestamp: undefined,
            //   wearable_states: undefined,
            //   header: undefined,
            //   picture: undefined,
            // };

            // // console.log(this.modalRef.content.content);

            // // this.modalRef.content._content.timestamp = moment(incident.timestamp);
            // auxContent.timestamp = moment(incident.created + "Z");

            // const wearable_states = incident.wearable_states;
            // if (wearable_states && wearable_states.length) {
            //   // this.modalRef.content._content.wearable_states = wearable_states;
            //   auxContent.wearable_states = wearable_states;

            //   // this.modalRef.content.header = Object.keys(wearable_states[0]).map(
            //   auxContent.header = Object.keys(wearable_states[0]).map(
            //     (elem) => `shared.${elem}`
            //   );
            // }

            // const picture = incident.picture;

            // // if (picture) this.modalRef.content._content.picture = picture;
            // if (picture) auxContent.picture = picture;

            // this.modalRef.content.content = auxContent;
            // console.log(this.modalRef.content);
            this.modalRef.content.content = incident;
            this.modalRef.content.loading = false;
            // this.dialogContentSubject.next(this.modalRef.content);
            // console.log(res, this.modalRef.content);
          }
        });

      this.subscriptions.push(sub);
    }
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
