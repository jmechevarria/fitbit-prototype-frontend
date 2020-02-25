/////////////INTERFACE BETWEEN FRONTEND AND BACKEND
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get("http://localhost:3000/api/v1/users");
  }

  getById(id: number) {
    return this.http.get(`http://localhost:3000/api/v1/users/${id}`);
  }

  register(user) {
    return this.http.post("http://localhost:3000/api/v1/users/register", user);
  }

  update(user) {
    return this.http.put(
      `http://localhost:3000/api/v1/users/${user.data.id}`,
      user
    );
  }

  delete(id: number) {
    return this.http.delete(`http://localhost:3000/api/v1/users/${id}`);
  }

  linkToFitbitAccount(userID: number, selectedFAIDs: number[]) {
    return this.http.post(
      `http://localhost:3000/api/v1/users/link/caregiver/fitbit-account/`,
      {
        userID,
        selectedFAIDs
      }
    );
  }

  unlinkFromFitbitAccount(userID: number, fitbitAccountID: number) {
    return this.http.delete(
      `http://localhost:3000/api/v1/users/unlink/caregiver/${userID}/fitbit-account/${fitbitAccountID}`
    );
  }

  getContacts(senior_person) {
    return this.http.post(`${environment.apiURL}/senior_person_contacts`, {
      senior_person
    });
  }
}
