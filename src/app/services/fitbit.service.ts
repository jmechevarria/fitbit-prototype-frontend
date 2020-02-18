import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FitbitService {
  /**
   * every time the admin requests access to fitbit.com, a new token and user id are returned, this variable serves as a
   * temp to know which app the access was requested for, then in app component's ngoninit, it is used to update the
   * access token and user id in the db according to this var's value
   */
  private TEMP_FITBIT_ACCOUNT_ID = "temp-fitbit-account-id";
  private configRedirectURI;
  private configOauthURL;
  private configScope;
  private configExpiresSec;

  constructor(private http: HttpClient) {
    const {
      configExpiresSec,
      configOauthURL,
      configRedirectURI,
      configScope
    } = environment;

    this.configExpiresSec = configExpiresSec;
    this.configOauthURL = configOauthURL;
    this.configRedirectURI = configRedirectURI;
    this.configScope = configScope;
  }

  // get accessToken() {
  //   return localStorage.getItem(this.ACCESS_TOKEN);
  // }

  // set accessToken(value) {
  //   localStorage.setItem(this.ACCESS_TOKEN, value);
  // }

  // set fitbitUserID(value) {
  //   localStorage.setItem(this.FITBIT_USER_ID, value);
  // }

  // get fitbitUserID() {
  //   return localStorage.getItem(this.FITBIT_USER_ID);
  // }

  set tempFitbitAccountID(value) {
    localStorage.setItem(
      this.TEMP_FITBIT_ACCOUNT_ID,
      value ? value.toString() : null
    );
  }

  get tempFitbitAccountID() {
    return parseInt(localStorage.getItem(this.TEMP_FITBIT_ACCOUNT_ID));
  }

  requestAccess(fitbitAccount) {
    this.tempFitbitAccountID = fitbitAccount.id;
    console.log(fitbitAccount);
    const clientID = fitbitAccount.client_id;
    window.location.href = `${this.configOauthURL}?response_type=token&scope=${this.configScope}&redirect_url=${this.configRedirectURI}
      &expires_in=${this.configExpiresSec}&client_id=${clientID}&state=test_state`;
  }

  relinquishAccess(fitbitAccountID) {
    return this.revokeAccess(fitbitAccountID).pipe(
      tap(
        () => {},
        response => {
          //on error
          console.log(response);
          //maybe redirect home
        }
      )
    );
  }

  private revokeAccess(fitbitAccountID) {
    return this.http.patch(
      `http://localhost:3000/api/v1/FITBIT/oauth2/revoke`,
      {
        values: {
          user_id: null,
          access_token: null,
          token_expires_on: null
        },
        where: {
          id: fitbitAccountID
        }
      }
    );
  }

  // stateOfToken() {
  //   let headers: HttpHeaders = new HttpHeaders({
  //     Authorization: "Bearer " + this.accessToken,
  //     "Content-type": "application/x-www-form-urlencoded"
  //   });

  //   let params = new URLSearchParams();
  //   params.append("token", this.accessToken);

  //   return this.http.post("https://api.fitbit.com/1.1/oauth2/introspect", params.toString(), {
  //     headers: headers
  //   });
  // }

  fetchHeartRateIntraday(fitbitAccountID: number, day: string) {
    console.log(fitbitAccountID, day);

    return this.http.get(
      `http://localhost:3000/api/v1/fitbit-account/${fitbitAccountID}/activities/heart/intraday/${day}`
    );
  }

  fetchHeartRateInterday(
    fitbitAccountID: number,
    from: string,
    to: string,
    clientOffset: string
  ) {
    return this.http.get(
      `http://localhost:3000/api/v1/daily-summary/${fitbitAccountID}/${from}/${to}/${clientOffset}`
    );
    // .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    // .pipe(delay(500))
    // .pipe(dematerialize());
  }

  fetchIncidents(incidentIDs, fitbitAccountID: number) {
    return this.http.get(
      `http://localhost:3000/api/v1/incidents/${fitbitAccountID}/?incident_ids=${incidentIDs
        .map(id => {
          return id;
        })
        .join(",")}`
    );
    // .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    // .pipe(delay(500))
    // .pipe(dematerialize());
  }
}
