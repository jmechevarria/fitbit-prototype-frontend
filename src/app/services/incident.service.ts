import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IncidentService {
  constructor(private http: HttpClient) {}

  get(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}incidents/${id}`);
  }

  search(queryParams): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}incidents/`, {
      params: queryParams,
    });
  }

  processIncident(values) {
    return this.http.patch(
      `${environment.apiURL}incidents/${values.id}/process-incident`,
      values
    );
  }
}
