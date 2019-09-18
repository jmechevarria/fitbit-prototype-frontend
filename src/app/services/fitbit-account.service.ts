/////////////INTERFACE BETWEEN FRONTEND AND BACKEND
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class FitbitAccountService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get("http://localhost:3000/api/v1/fitbit-accounts");
  }

  delete(id: number) {
    return this.http.delete(`http://localhost:3000/api/v1/fitbit-accounts/${id}`);
  }

  // getAll() {
  //   return this.http.get<FitbitAccount[]>("http://localhost:3000/api/v1/users");
  // }

  // getById(id: number) {
  //   return this.http.get(`http://localhost:3000/api/v1/users/${id}`);
  // }

  // register(user: User) {
  //   return this.http.post("http://localhost:3000/api/v1/users/register", user);
  // }

  // update(user: User) {
  //   return this.http.put(`http://localhost:3000/api/v1/users/${user.data.id}`, user);
  // }

  // delete(id: number) {
  //   return this.http.delete(`http://localhost:3000/api/v1/users/${id}`);
  // }
}
