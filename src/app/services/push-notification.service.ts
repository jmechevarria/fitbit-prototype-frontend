import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";

@Injectable({ providedIn: "root" })
export class PushNotificationService {
  constructor(private http: HttpClient) {}

  public sendSubscriptionToTheServer(subscription: PushSubscription) {
    console.log("subscription object sent: ", subscription);

    return this.http.post(environment.subscription_url, subscription);
  }
}
