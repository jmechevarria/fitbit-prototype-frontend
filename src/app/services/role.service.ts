import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Role } from "../models/Role";

@Injectable({ providedIn: "root" })
export class RoleService {
  constructor(private http: HttpClient) {}

  get(): Observable<Role[]> {
    return this.http.get<any[]>(`${environment.apiURL}roles/`);
  }

  getByID(id: number): Observable<Role> {
    return this.http.get<any>(`${environment.apiURL}roles/${id}`);
  }

  create(role: Role): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiURL}roles/new/`, role);
  }

  patch(where, values) {
    return this.http.patch(`${environment.apiURL}user`, {
      values,
      where
    });
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiURL}roles/${id}`);
  }
}
