import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { User } from "../models/User";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  get(roleID?: number): Observable<User[]> {
    return this.http.get<any[]>(
      `${environment.apiURL}users`,
      roleID
        ? {
            params: { role_id: roleID.toString() }
          }
        : {}
    );
  }

  getByID(id: number, role_id: number): Observable<User> {
    return this.http.get<any>(`${environment.apiURL}users/${id}/${role_id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<any>(`${environment.apiURL}users/new`, user);
  }

  patch(values: User): Observable<User> {
    return this.http.patch<any>(
      `${environment.apiURL}users/${values.id}/${values.role_id}`,
      values
    );
  }

  delete(id: number): Observable<User> {
    return this.http.delete<any>(`${environment.apiURL}users/${id}`);
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

  // getContacts(client_account) {
  //   return this.http.get(
  //     `${environment.apiURL}client_account/${client_account.id}/contacts`
  //   );
  // }
}
