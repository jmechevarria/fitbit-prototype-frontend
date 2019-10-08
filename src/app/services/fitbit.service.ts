import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap, materialize, delay, dematerialize } from "rxjs/operators";
import { of } from "rxjs";
import { Device } from "../models/device";
import { FitbitApp } from "../models/FitbitApp";
import { FitbitAccount } from "../models/FitbitAccount";
import * as moment from "moment";
import { User } from "../models/User";
import { FitbitAppService } from "./fitbit-app.service";

@Injectable({
  providedIn: "root"
})
export class FitbitService {
  /**
   * every time the admin requests access to fitbit.com, a new token and user id are returned, this variable serves as a
   * temp to know which app the access was requested for, then in app component's ngoninit, it is used to update the
   * access token and user id in the db according to this var's value
   */
  private TEMP_FITBIT_APP_ID = "temp-fitbit-app-id";
  private configRedirectURI;
  private configOauthURL;
  private configScope;
  private configExpiresSec;

  constructor(private http: HttpClient, private fitbitAppService: FitbitAppService) {
    const { configExpiresSec, configOauthURL, configRedirectURI, configScope } = environment;

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

  set tempFitbitAppID(value) {
    localStorage.setItem(this.TEMP_FITBIT_APP_ID, !!value ? value.toString() : null);
  }

  get tempFitbitAppID() {
    return parseInt(localStorage.getItem(this.TEMP_FITBIT_APP_ID));
  }

  // get fitbitApps(): [] {
  //   return JSON.parse(localStorage.getItem(this.FITBIT_APPS));
  // }

  // get dateRanges() {
  //   return { "1d": "24 hours", "7d": "7 days", "30d": "30 days", "1w": "week", "1m": "month" };
  // }

  requestAccess(fitbitApp) {
    this.tempFitbitAppID = fitbitApp.id;
    const fitbitAppClientID = fitbitApp.client_id;
    window.location.href = `${this.configOauthURL}?response_type=token&scope=${this.configScope}&redirect_url=${this.configRedirectURI}
      &expires_in=${this.configExpiresSec}&client_id=${fitbitAppClientID}&state=test_state`;
  }

  relinquishAccess(fitbitAppID) {
    return this.revokeAccess(fitbitAppID).pipe(
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

  private revokeAccess(fitbitAppID) {
    return this.http.patch(`http://localhost:3000/api/v1/FITBIT/oauth2/revoke`, {
      values: {
        user_id: null,
        access_token: null
      },
      where: {
        id: fitbitAppID
      }
    });
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

  getUserProfile() {
    return this.http.get("https://api.fitbit.com/1/user/-/profile.json");
  }

  // getHeartRateInterday(from: string, to: string) {
  //   return this.http.get("https://api.fitbit.com/1/user/-/activities/heart/date/" + from + "/" + to + ".json");
  // }

  fetchHeartRateIntraday(fitbitAccountID: number, from: string, to: string) {
    console.log(fitbitAccountID, from, to);
    return this.http.get(
      `http://localhost:3000/api/v1/fitbit-account/${fitbitAccountID}/device/1/activities/heart/intraday/${from}/${to}`
    );
    // return this.http.get("https://api.fitbit.com/1/user/-/activities/heart/date/" + from + "/" + to + "/1min.json");
    // https://api.fitbit.com/1/user/-/activities/heart/date/[date]/[end-date]/[detail-level]/time/[start-time]/[end-time].json
    // return this.http.get(
    //   "https://api.fitbit.com/1/user/-/activities/heart/date/" + from + "/" + to + "/1min/time/00:00/00:10.json"
    // );
  }

  fetchHeartRateInterday(fitbitAccountID: number, from: string, to: string) {
    return this.http.get(
      `http://localhost:3000/api/v1/fitbit-account/${fitbitAccountID}/device/1/activities/heart/interday/${from}/${to}`
    );
    // .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    // .pipe(delay(500))
    // .pipe(dematerialize());
  }
}
