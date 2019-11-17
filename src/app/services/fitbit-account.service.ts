/////////////INTERFACE BETWEEN FRONTEND AND BACKEND
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class FitbitAccountService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get("http://localhost:3000/api/v1/fitbit-accounts");
  }

  get(id: number) {
    return this.http.get(`http://localhost:3000/api/v1/fitbit-accounts/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`http://localhost:3000/api/v1/fitbit-accounts/${id}`);
  }

  patch(id: number, data) {
    return this.http.patch(`http://localhost:3000/api/v1/fitbit-account`, {
      values: data,
      where: {
        id: id
      }
    });
  }

  // getAll() {
  //   return this.http.get<FitbitAccount[]>("http://localhost:3000/api/v1/users");
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
