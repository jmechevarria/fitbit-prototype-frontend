import { BehaviorSubject, Observable } from "rxjs";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { tap, map } from "rxjs/operators";

import { AuthenticationService } from "./authentication.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { environment } from "src/environments/environment.prod";

const VAPID_PUBLIC =
  "BCLqXPqZe-QWv8hQ-2RR9g5VKrhJnGHiM0PN0hs-xgka4inF2ylT5sjWd-8fyGT2OC1xagNR4D0SqgbDPjH8VD0";

@Injectable({ providedIn: "root" })
export class SubscriptionNotificationService {
  private currentUser;
  private subscription: PushSubscription;
  private _notificationSubject$: BehaviorSubject<any[]> = new BehaviorSubject(
    []
  );

  notifications$: Observable<
    any[]
  > = this._notificationSubject$.asObservable().pipe(
    map(messages => {
      // console.log(
      //   "pass filter",
      //   this.currentUser && messages["userID"] === this.currentUser.id
      // );
      // console.log("message", messages, this.currentUser);

      return messages.filter(m => {
        return this.currentUser && m["userID"] === this.currentUser.id;
      });
    })
  );

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private authenticationService: AuthenticationService,
    private matSnackBar: MatSnackBar
  ) {
    // TODO: maybe clean up subscription
    this.swPush.messages
      .pipe(
        tap(n => {
          console.log("receive notif", n);

          const all = this._notificationSubject$.getValue();
          this._notificationSubject$.next([n, ...all]);
        })
      )
      .subscribe();
    this.swUpdate.available.subscribe(update => {
      console.log(update);
      this.matSnackBar
        .open(
          "Update avaiblable. Reload window to view latest version.",
          "Reload"
        )
        .onAction()
        .subscribe(() => {
          window.location.reload();
        });
    });

    this.authenticationService.currentUser$
      // .pipe(
      //   // filter(user => {
      //   //   console.log("filter user", user);
      //   //   return !!user;
      //   // }),
      //   tap(user => {
      //     this.allMessages$ = this.swPush.messages.pipe(
      //       filter(message => {
      //         console.log("filter message", user.id, message["userID"]);

      //         return user && message["userID"] === user.id;
      //       })
      //     );
      //   })
      // )
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  public subscribeToPN() {
    // console.log("subscribe to pn");

    if (this.swPush.isEnabled) {
      try {
        this.swPush
          .requestSubscription({
            serverPublicKey: VAPID_PUBLIC
          })
          .then(subscription => {
            // this.subscription = subscription;

            //create subscription in our backend
            this.createSubscription(subscription).subscribe();
          })
          .catch(error => {
            console.error(error);
          });
      } catch (error) {
        console.log("error processing subscription on the frontend", error);
      }
      // this.swPush.subscription.subscribe(subscription => {
      // console.log("triggered");

      // // if (this.subscription) {
      // //<-------- here we check if this device is already subscribed
      // console.log("device already subscribed", this.subscription);

      // // this.subscription = subscription;

      // //the device is already subscribed, but we still need to check if the user is subscribed
      // //create subscription in our backend
      // this.createSubscription(this.subscription).subscribe(response => {
      //   console.log("response: " + response);
      // });

      // this.swUpdate.available.subscribe(update => {
      //   console.log(update);
      //   this.matSnackBar
      //     .open("Update Avaiblable", "Reload")
      //     .onAction()
      //     .subscribe(() => {
      //       window.location.reload();
      //     });
      // });
      // } else {
      // console.log("device not yet subscribed", this.subscription);

      // }
      // });
    }
  }

  private createSubscription(subscription: PushSubscription) {
    console.log("here we use this.currentUser", this.currentUser);
    return this.http.post(`${environment.apiURL}subscribe_to_pn`, {
      subscription,
      userID: this.currentUser.id
    });
  }

  unsubscribeFromPN() {
    console.log("unsubscribe from pn");

    console.log(this.subscription);
    if (this.subscription && this.currentUser) {
      console.log("in");
      // this.subscription
      //   .unsubscribe()
      const endpoint = this.subscription.endpoint;
      console.log(endpoint, this.currentUser.id);
      this.http
        .delete(
          `${environment.apiURL}unsubscribe_from_pn/${encodeURIComponent(
            endpoint
          )}/${this.currentUser.id}`
        )
        .subscribe(response => {
          console.log("response", response);
          if (!response["length"])
            this.swPush
              .unsubscribe()
              .then(response => {})
              .catch(error => console.log(error, error.toString()));
        });
    }
  }

  // getMessages() {
  //   const allMessagesForCurrentUser$ = this.swPush.messages.pipe(
  //     filter(
  //       message =>
  //         this.currentUser && message["userID"] === this.currentUser.id
  //     )
  //   );

  //   return allMessagesForCurrentUser$;
  // }

  /**
   *
   * @param userID
   * @param limit
   * @param param2
   */
  fetchFromDB(userID, queryParams): Observable<any[]> {
    // console.log(range);

    return this.http.get<any[]>(`${environment.apiURL}messages/1/${userID}`, {
      params: queryParams
    });
  }

  update(values) {
    console.log(values);

    return this.http.patch(
      `${environment.apiURL}messages/${values.id}/${values.type}`,
      values
    );
  }

  sendEmail(addresses: any, subject: any, body: any) {
    return this.http.post(
      `${environment.apiURL}notifications/notify_contacts/email`,
      {
        addresses,
        subject,
        body
      }
    );
  }
}
