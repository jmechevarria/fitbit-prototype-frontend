import { BehaviorSubject, Observable } from "rxjs";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { tap, map } from "rxjs/operators";

import { AuthenticationService } from "./authentication.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { environment } from "src/environments/environment.prod";

@Injectable({ providedIn: "root" })
export class SubscriptionNotificationService {
  private currentUser;
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

  // sendEmail(addresses: any, subject: any, body: any) {
  //   return this.http.post(
  //     `${environment.apiURL}messages/notify-contacts/email`,
  //     {
  //       addresses,
  //       subject,
  //       body
  //     }
  //   );
  // }
}
