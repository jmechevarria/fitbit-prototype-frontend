import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FitbitService {
  private ACCESS_TOKEN = "access-token";
  private USER_ID = "user-id";

  private configRedirectURI;
  private configOauthURL;
  private configScope;
  private configExpiresSec;
  private secret;
  private fitbitAPIApplicationID;

  constructor(private http: HttpClient) {
    const {
      fitbitAPIApplicationID,
      configExpiresSec,
      configOauthURL,
      configRedirectURI,
      configScope,
      secret
    } = environment;
    this.fitbitAPIApplicationID = fitbitAPIApplicationID;
    this.configExpiresSec = configExpiresSec;
    this.configOauthURL = configOauthURL;
    this.configRedirectURI = configRedirectURI;
    this.configScope = configScope;
    this.secret = secret;
  }

  get accessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  set accessToken(value) {
    localStorage.setItem(this.ACCESS_TOKEN, value);
  }

  set userID(value) {
    localStorage.setItem(this.USER_ID, value);
  }

  get userID() {
    return localStorage.getItem(this.USER_ID);
  }

  requestAccess() {
    window.location.href = `${this.configOauthURL}?response_type=token&scope=${this.configScope}&redirect_url=${this.configRedirectURI}
      &expires_in=${this.configExpiresSec}&client_id=${this.fitbitAPIApplicationID}&state=test_state`;
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
      const authEncoded = btoa(`${this.fitbitAPIApplicationID}:${this.secret}`);

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
    this.userID = null;
  }

  getUserProfile() {
    return this.http.get("https://api.fitbit.com/1/user/-/profile.json");
  }

  getHeartRateTimeSeries(from: string, to: string) {
    return this.http.get("https://api.fitbit.com/1/user/-/activities/heart/date/" + from + "/" + to + ".json");
  }

  getHeartRateIntraday(from: string, to: string) {
    return this.http.get(
      "https://api.fitbit.com/1/user/-/activities/heart/date/" + "2019-08-10" + "/" + "2019-08-10" + "/1min.json"
    );
  }
}
