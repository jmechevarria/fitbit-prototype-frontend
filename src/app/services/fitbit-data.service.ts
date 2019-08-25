import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class FitbitDataService {
  private config_redirect_uri = "http://localhost:4200/dashboard/";
  private config_oauth_url = "https://www.fitbit.com/oauth2/authorize";
  private config_scope = "heartrate sleep activity profile";
  private config_expires_sec = 30 * 24 * 60 * 60; // 30 days
  // private config_api_url = "https://api.fitbit.com/1/user/-/activities/heart/date";
  // por favor mira getdata.php /private date/1d/1sec/time/00:00/23:59.json";
  private secret = "246052c37c44576eb6dbbd7f81956fc5";
  private clientID = "22B7Z6";

  constructor(private http: HttpClient) {}

  authenticate(clientID: string) {
    window.location.href = `${this.config_oauth_url}?response_type=token&scope=${this.config_scope}&redirect_url=${this.config_redirect_uri}
      &expires_in=${this.config_expires_sec}&client_id=${clientID}&state=test_state`;
    // window.location.href = `${this.config_oauth_url}?response_type=token&scope=${this.config_scope}
    // &expires_in=${this.config_expires_sec}&client_id=${clientID}`;
  }

  logout() {
    const authEncoded = btoa(`${this.clientID}:${this.secret}`);

    let headers: HttpHeaders = new HttpHeaders({
      Authorization: "Basic " + authEncoded,
      "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
    });

    let params = new URLSearchParams();
    params.append("token", localStorage.getItem("access-token"));

    return this.http.post("https://api.fitbit.com/oauth2/revoke", params.toString(), {
      headers: headers
    });
  }

  isAuthenticated() {
    return !!localStorage.getItem("access-token");
  }

  clearAccessToken() {
    // let params = new URLSearchParams();
    // params.append("federated", "");
    // console.log("clear");
    // this.http.post("https://api.fitbit.com/v2/logout", params.toString());

    localStorage.removeItem("access-token");
  }

  getUserID() {
    return localStorage.getItem("user-id");
  }

  getUserProfile() {
    let headers: HttpHeaders = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("access-token")
      // "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
    });

    return this.http.get("https://api.fitbit.com/1/user/-/profile.json", {
      headers
    });
  }

  getHeartRateTimeSeries(from: string, to: string) {
    let headers: HttpHeaders = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("access-token")
      // Authorization: "Bearer " + localStorage.getItem("access-token")
      // "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
    });

    return this.http.get("https://api.fitbit.com/1/user/-/activities/heart/date/" + from + "/" + to + ".json", {
      // return this.http.get("https://api.fitbit.com/1/user/-/activities/heart/date/2018-03-01/2018-04-01.json", {
      headers
    });
  }
}
