import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { FitbitAccount } from "../models/FitbitAccount";

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
    const clientID = fitbitAccount.fitbit_app_id;
    window.location.href = `${this.configOauthURL}?response_type=token&scope=${this.configScope}&redirect_uri=${this.configRedirectURI}&expires_in=${this.configExpiresSec}&client_id=${clientID}&state=test_state`;
  }

  relinquishAccess(fitbitAccountID: number): Observable<FitbitAccount> {
    return this.http.patch<FitbitAccount>(
      `${environment.apiURL}FITBIT/oauth2/revoke/${fitbitAccountID}`,
      {} //encoded_id and access_token are to be set to null
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
  }

  fetchIncidents(incidentIDs, fitbitAccountID: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:3000/api/v1/incidents/${fitbitAccountID}/?incident_ids=${incidentIDs
        .map(id => {
          return id;
        })
        .join(",")}`
    );
  }

  fetchLatestRecordedStates(
    clientAccountsIDs: number[],
    clientMoment
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiURL}latest_recorded_states/`,
      {
        params: {
          clientAccountsIDs: clientAccountsIDs.join(","),
          clientMomentString: clientMoment.format()
        }
      }
    );
  }
}
