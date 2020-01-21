import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../models/User";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private _CURRENT_USER = "current-user";
  //holds info about fitbit accounts not related to the current user/caregiver
  private _OTHER_FITBIT_ACCOUNTS = "other-fitbit-accounts";
  // private JWT = "own-token";

  private currentUserSubject$: BehaviorSubject<User>;
  public currentUser$: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject$ = new BehaviorSubject<User>(this.currentUser);
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem(this._CURRENT_USER));
  }

  set currentUser(value) {
    localStorage.setItem(this._CURRENT_USER, JSON.stringify(value));
  }

  get otherFitbitAccounts() {
    return JSON.parse(localStorage.getItem(this._OTHER_FITBIT_ACCOUNTS));
  }

  set otherFitbitAccounts(value) {
    localStorage.setItem(this._OTHER_FITBIT_ACCOUNTS, JSON.stringify(value));
  }

  get isAuthenticated() {
    return !!this.currentUser;
  }

  login(username: string, password: string) {
    // return this.http.post<any>(`${config.apiUrl}/users/authenticate`, { username, password }).pipe(
    return this.http
      .post<any>("http://localhost:3000/api/v1/login", { username, password })
      .pipe(
        tap(response => {
          console.log(response);
          // login successful if there's a jwt token in the response
          if (response && response.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.currentUser = response;
            this.currentUserSubject$.next(this.currentUser);
          }
        })
      );
  }

  // saveInfoInLocalStorage(user: any) {
  //   this.currentUser = user;
  // }

  logout() {
    this.currentUser = null;
    // this.token = null;
    this.currentUserSubject$.next(null);
  }
}
