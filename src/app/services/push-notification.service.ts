import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";
import { filter } from "rxjs/operators";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { MatSnackBar } from "@angular/material";
import { AuthenticationService } from "./authentication.service";

const VAPID_PUBLIC =
  "BCLqXPqZe-QWv8hQ-2RR9g5VKrhJnGHiM0PN0hs-xgka4inF2ylT5sjWd-8fyGT2OC1xagNR4D0SqgbDPjH8VD0";
// "privateKey":"OkNDVpMzXz7CW_G7s07hxsogeh2XeJiOoogWfBLQRxw"

@Injectable({ providedIn: "root" })
export class PushNotificationService {
  private currentUser;
  private subscription: PushSubscription;

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private authenticationService: AuthenticationService,
    private matSnackBar: MatSnackBar
  ) {
    this.authenticationService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    console.log(" constructor");
    this.swPush.subscription.subscribe(subscription => {
      this.subscription = subscription;
    });
  }

  public subscribeToPN() {
    if (this.swPush.isEnabled && this.currentUser) {
      try {
        this.swPush
          .requestSubscription({
            serverPublicKey: VAPID_PUBLIC
          })
          .then(subscription => {
            this.subscription = subscription;

            // send subscription to the server
            this.createSubscription(subscription).subscribe(response => {
              console.log("response: " + response);
            });
          })
          .catch(error => {
            console.error(error);
          });

        this.swUpdate.available.subscribe(update => {
          console.log(update);
          this.matSnackBar
            .open("Update Avaiblable", "Reload")
            .onAction()
            .subscribe(() => {
              window.location.reload();
            });
        });
      } catch (error) {
        console.log("error processing subscription on the frontend", error);
      }
    }
  }

  private createSubscription(subscription: PushSubscription) {
    return this.http.post(`${environment.apiURL}/subscribe_to_pn`, {
      subscription,
      userID: this.currentUser.data.id
    });
  }

  unsubscribeFromPN() {
    if (this.subscription && this.currentUser) {
      const endpoint = this.subscription.endpoint;
      this.swPush
        .unsubscribe()
        .then(response => {
          console.log(endpoint, this.currentUser.data.id);

          this.http
            .delete(
              `${environment.apiURL}/unsubscribe_from_pn/${encodeURIComponent(
                endpoint
              )}/${this.currentUser.data.id}`
            )
            .subscribe();
          console.log("response", response);
        })
        .catch(error => console.log(error, error.toString()));
    }
  }

  getMessages() {
    return this.swPush.messages.pipe(
      filter(
        message =>
          this.currentUser && message["userID"] === this.currentUser.data.id
      )
    );
  }

  /**
   *
   * @param userID
   * @param limit
   * @param param2
   */
  fetchFromDB(userID, limit, range: { from?; to? }) {
    console.log(range);

    return this.http.get(
      `${environment.apiURL}/notifications/${userID}/?limit=${limit}`,
      {
        params: {
          from: range.from ? range.from : "",
          to: range.to ? range.to : ""
        }
      }
    );
  }

  update(values, where) {
    return this.http.patch(`${environment.apiURL}/notifications/`, {
      values,
      where
    });
  }
}
