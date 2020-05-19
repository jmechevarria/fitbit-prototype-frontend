import { Component, OnInit } from "@angular/core";
import { MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { Subscription, Observable } from "rxjs";
import { IncidentService } from "src/app/services/incident.service";
import { IncidentDetailsDialogComponent } from "./incident_details_dialog/incident-details-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

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

  selectedIncidentID: number; //when redirecting from notifications drop-down
  constructor(
    private mDBModalService: MDBModalService,
    private incidentService: IncidentService,
    private activatedRoute: ActivatedRoute,
    // private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    try {
      const sub = this.incidentService
        .search({
          // from: moment().subtract(1, "d").format("YYYY-MM-DD HH:mm:ss.SSSZ"),
          // to: moment().format("YYYY-MM-DD HH:mm:ss.SSSZ"),
          limit: 20,
        })
        .subscribe((incidents) => {
          console.log(incidents);

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

    // The Router manages the observables it provides and localizes the subscriptions.
    // The subscriptions are cleaned up when the component is destroyed, protecting against memory leaks,
    // so we don't need to unsubscribe from the route params Observable.
    this.activatedRoute.queryParams.subscribe((params) => {
      // this.selectedIncidentID = params.incident_id;
      if (params.incident_id) this.auxViewIncidentDetails(params.incident_id);
      // this.router.navigateByUrl(window.location.href);
      console.log(window.location);
      console.log(params);
      this.location.go(window.location.pathname);
      // window.location.hash = "";
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  processIncident(incident, accident: boolean) {
    console.log(incident, accident);

    const sub = this.incidentService
      .processIncident({ ...incident, actual_accident: accident })
      .subscribe((response) => {
        if (response) console.log(response);
        incident.actual_accident = accident;
        incident.processed = true;
      });
    this.subscriptions.push(sub);
  }

  viewIncidentDetails(event, incident) {
    if (event.target.tagName == "TD") {
      this.auxViewIncidentDetails(incident.id);
    }
  }

  private auxViewIncidentDetails(id) {
    this.modalRef = this.mDBModalService.show(IncidentDetailsDialogComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      ignoreBackdropClick: false,
      animated: true,
      class: "modal-dialog-scrollable incident-details-dialog", //incident-details-dialog class is used in styles.scss
      data: {
        title: "incidents_panel.dialog.incident_details.title",
        header: [],
      },
    });

    const sub = this.incidentService.get(id).subscribe((incident) => {
      console.log(incident);

      if (incident) {
        this.modalRef.content.content = incident;
        this.modalRef.content.loading = false;
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
  //   const title$ = this.translate.get("incidents_panel.dialog.title");
  //   const body$ = this.translate.get(
  //     "incidents_panel.dialog.email_confirmation.body",
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
