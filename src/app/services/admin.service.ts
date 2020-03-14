import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { User } from "../models/User";

@Injectable({ providedIn: "root" })
export class AdminService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}users`);
  }

  get(where: {}): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}users`, {
      params: where
    });
  }

  create(user: User): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiURL}users/new`, user);
  }

  patch(where, values) {
    return this.http.patch(`${environment.apiURL}user`, {
      values,
      where
    });
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiURL}users/${id}`);
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
}
