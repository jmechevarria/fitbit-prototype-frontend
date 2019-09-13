import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { of } from "rxjs";
import { Device } from "../models/device";
import { FitbitApp } from "../models/FitbitApp";
import { FitbitAccount } from "../models/FitbitAccount";
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export class FitbitService {
  private ACCESS_TOKEN = "access-token";
  private FITBIT_USER_ID = "fitbit-user-id";
  private CURRENT_FITBIT_APP_ID = "current-fitbit-app-id";
  private FITBIT_APPS = "fitbit-apps";

  private configRedirectURI;
  private configOauthURL;
  private configScope;
  private configExpiresSec;

  constructor(private http: HttpClient) {
    const { configExpiresSec, configOauthURL, configRedirectURI, configScope } = environment;

    this.configExpiresSec = configExpiresSec;
    this.configOauthURL = configOauthURL;
    this.configRedirectURI = configRedirectURI;
    this.configScope = configScope;
  }

  get accessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  set accessToken(value) {
    localStorage.setItem(this.ACCESS_TOKEN, value);
  }

  set fitbitUserID(value) {
    localStorage.setItem(this.FITBIT_USER_ID, value);
  }

  get fitbitUserID() {
    return localStorage.getItem(this.FITBIT_USER_ID);
  }

  set currentFitbitAppID(value) {
    localStorage.setItem(this.CURRENT_FITBIT_APP_ID, value);
  }

  get currentFitbitAppID() {
    return localStorage.getItem(this.CURRENT_FITBIT_APP_ID);
  }

  get fitbitApps(): [] {
    return JSON.parse(localStorage.getItem(this.FITBIT_APPS));
  }

  // get dateRanges() {
  //   return { "1d": "24 hours", "7d": "7 days", "30d": "30 days", "1w": "week", "1m": "month" };
  // }

  requestAccess(fitbitAppID: string) {
    this.currentFitbitAppID = fitbitAppID;
    window.location.href = `${this.configOauthURL}?response_type=token&scope=${this.configScope}&redirect_url=${this.configRedirectURI}
      &expires_in=${this.configExpiresSec}&client_id=${fitbitAppID}&state=test_state`;
  }

  relinquishAccess() {
    return this.revokeAccess().pipe(
      tap(
        () => {
          //on success
          this.clearAccessTokens();
        },
        response => {
          //on error
          console.log(response);
          //maybe redirect home
        }
      )
    );
  }

  private revokeAccess() {
    if (this.appHasAccess()) {
      const currentFitbitAppSecret = this.fitbitApps.find(fitbitApp => {
        return fitbitApp["id"] === this.currentFitbitAppID;
      })["secret"];

      const authEncoded = btoa(`${this.fitbitUserID}:${currentFitbitAppSecret}`);

      let headers: HttpHeaders = new HttpHeaders({
        Authorization: "Basic " + authEncoded,
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      });

      let params = new URLSearchParams();
      params.append("token", this.accessToken);
      return this.http.post("https://api.fitbit.com/oauth2/revoke", params.toString(), {
        headers: headers
      });
    } else {
      return of(new HttpResponse());
    }
  }

  stateOfToken() {
    let headers: HttpHeaders = new HttpHeaders({
      Authorization: "Bearer " + this.accessToken,
      "Content-type": "application/x-www-form-urlencoded"
    });

    let params = new URLSearchParams();
    params.append("token", this.accessToken);

    return this.http.post("https://api.fitbit.com/1.1/oauth2/introspect", params.toString(), {
      headers: headers
    });
  }

  appHasAccess() {
    return this.accessToken !== "null";
  }

  clearAccessTokens() {
    this.accessToken = null;
    this.fitbitUserID = null;
    this.currentFitbitAppID = null;
  }

  getUserProfile() {
    return this.http.get("https://api.fitbit.com/1/user/-/profile.json");
  }

  getHeartRateInterday(from: string, to: string) {
    return this.http.get("https://api.fitbit.com/1/user/-/activities/heart/date/" + from + "/" + to + ".json");
  }

  getHeartRateIntraday(from: string, to: string) {
    return this.http.get("https://api.fitbit.com/1/user/-/activities/heart/date/" + from + "/" + to + "/1min.json");
    // https://api.fitbit.com/1/user/-/activities/heart/date/[date]/[end-date]/[detail-level]/time/[start-time]/[end-time].json
    // return this.http.get(
    //   "https://api.fitbit.com/1/user/-/activities/heart/date/" + from + "/" + to + "/1min/time/00:00/00:10.json"
    // );
  }
}
