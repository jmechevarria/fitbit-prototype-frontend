import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Role } from "../models/Role";

@Injectable({ providedIn: "root" })
export class RoleService {
  constructor(private http: HttpClient) {}

  get(): Observable<Role[]> {
    return this.http.get<any[]>(`${environment.apiURL}roles`);
  }
}
