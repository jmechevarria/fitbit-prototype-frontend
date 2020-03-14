import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FitbitAccount } from "../models/FitbitAccount";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class FitbitAccountService {
  constructor(private http: HttpClient) {}

  // getAll(): Observable<any[]> {
  //   return this.http.get<any[]>(`${environment.apiURL}fitbit-accounts`);
  // }

  // getByID(id: number): Observable<any[]> {
  //   return this.http.get<FitbitAccount[]>(
  //     `${environment.apiURL}fitbit-accounts/${id}`
  //   );
  // }

  // create(fitbitAccount: FitbitAccount): Observable<any[]> {
  //   return this.http.post<any[]>(
  //     `${environment.apiURL}fitbit-accounts/new`,
  //     fitbitAccount
  //   );
  // }

  patch(id: number, values) {
    return this.http.patch(
      `${environment.apiURL}fitbit-accounts/${id}`,
      values
    );
  }

  // delete(id: number) {
  //   return this.http.delete(`${environment.apiURL}fitbit-accounts/${id}`);
  // }
}
