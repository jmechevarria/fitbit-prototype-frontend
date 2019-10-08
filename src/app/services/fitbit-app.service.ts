import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class FitbitAppService {
  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get(`http://localhost:3000/api/v1/fitbit-apps/${id}`);
  }

  updateAccessTokenAndUserID(id: number, data) {
    return this.http.patch(`http://localhost:3000/api/v1/fitbit-apps`, {
      values: data,
      where: {
        id: id
      }
    });
  }
}
