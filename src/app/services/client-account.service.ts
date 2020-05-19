import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ClientAccount } from "../models/ClientAccount";

@Injectable({ providedIn: "root" })
export class ClientAccountService {
  constructor(private http: HttpClient) {}

  get(type_id?: number): Observable<ClientAccount[]> {
    return this.http.get<ClientAccount[]>(
      `${environment.apiURL}client-accounts`,
      type_id
        ? {
            params: { type_id: type_id.toString() },
          }
        : {}
    );
  }

  getByID(id: number, type_id: number): Observable<ClientAccount> {
    return this.http.get<ClientAccount>(
      `${environment.apiURL}client-accounts/${id}/${type_id}`
    );
  }

  getByUser(): Observable<ClientAccount[]> {
    return this.http.get<ClientAccount[]>(
      `${environment.apiURL}client-accounts/get-by-user`
    );
  }

  create(ClientAccount: ClientAccount): Observable<ClientAccount> {
    return this.http.post<ClientAccount>(
      `${environment.apiURL}client-accounts/new`,
      ClientAccount
    );
  }

  patch(values): Observable<ClientAccount> {
    return this.http.patch<ClientAccount>(
      `${environment.apiURL}client-accounts/${values.id}/${values.type_id}`,
      values
    );
  }

  delete(id: number): Observable<ClientAccount> {
    return this.http.delete<ClientAccount>(
      `${environment.apiURL}client-accounts/${id}`
    );
  }
}
