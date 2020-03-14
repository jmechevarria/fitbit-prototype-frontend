import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { User } from "../models/User";
import { AuthenticationService } from "./authentication.service";
import { SwPush } from "@angular/service-worker";

@Injectable({ providedIn: "root" })
export class UserService {
  private subscription: PushSubscription;
  private currentUser;
  private VAPID_PUBLIC =
    "BCLqXPqZe-QWv8hQ-2RR9g5VKrhJnGHiM0PN0hs-xgka4inF2ylT5sjWd-8fyGT2OC1xagNR4D0SqgbDPjH8VD0";

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private swPush: SwPush
  ) {
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

  get(roleID?: number): Observable<User[]> {
    return this.http.get<any[]>(
      `${environment.apiURL}users`,
      roleID
        ? {
            params: { role_id: roleID.toString() }
          }
        : {}
    );
  }

  getByID(id: number, role_id: number): Observable<User> {
    return this.http.get<any>(`${environment.apiURL}users/${id}/${role_id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<any>(`${environment.apiURL}users/new`, user);
  }

  patch(values: User): Observable<User> {
    return this.http.patch<any>(
      `${environment.apiURL}users/${values.id}/${values.role_id}`,
      values
    );
  }

  delete(id: number): Observable<User> {
    return this.http.delete<any>(`${environment.apiURL}users/${id}`);
  }

  linkToClientAccount(
    userID: number,
    clientAccountIDs: number[]
  ): Observable<any[]> {
    return this.http.post<any[]>(
      `${environment.apiURL}users/link/user/client-account`,
      {
        userID,
        clientAccountIDs
      }
    );
  }

  unlinkFromClientAccount(userID: number, clientAccountID: number) {
    return this.http.delete(
      `${environment.apiURL}users/unlink/user/${userID}/client-account/${clientAccountID}`
    );
  }
  public requestPNSubscription() {
    // console.log("subscribe to pn");

    if (this.swPush.isEnabled) {
      try {
        this.swPush
          .requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC
          })
          .then(subscription => {
            //create subscription in our backend
            this.subscribeToPN(subscription).subscribe();
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

  unsubscribeFromPN() {
    console.log("unsubscribe from pn");

    console.log(this.subscription);
    if (this.subscription && this.currentUser) {
      console.log("in");

      console.log(this.subscription.endpoint, this.currentUser.id);

      this.http
        .delete(
          `${environment.apiURL}users/${
            this.currentUser.id
          }/unsubscribe-from-pn/${encodeURIComponent(
            this.subscription.endpoint
          )}`
        )
        .subscribe();

      this.swPush
        .unsubscribe()
        .then()
        .catch(error => console.log(error, error.toString()));
    }
  }

  private subscribeToPN(subscription: PushSubscription) {
    console.log("here we use this.currentUser", this.currentUser);
    return this.http.post(`${environment.apiURL}subscribe-to-pn`, {
      subscription,
      userID: this.currentUser.id
    });
  }
}
