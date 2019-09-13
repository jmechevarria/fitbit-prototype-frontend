import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../models/User";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private CURRENT_USER = "current-user";
  private JWT = "own-token";

  private currentUserSubject$: BehaviorSubject<User>;
  public currentUser$: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject$ = new BehaviorSubject<User>(this.user);
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  get token() {
    return localStorage.getItem(this.JWT);
  }

  set token(value) {
    localStorage.setItem(this.JWT, value);
  }

  get user(): User {
    return JSON.parse(localStorage.getItem(this.CURRENT_USER)) as User;
  }

  set user(value: User) {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(value));
  }

  get isAuthenticated() {
    return this.token !== "null";
  }

  login(username: string, password: string) {
    // return this.http.post<any>(`${config.apiUrl}/users/authenticate`, { username, password }).pipe(
    return this.http.post<any>("http://localhost:3000/api/v1/authenticate", { username, password }).pipe(
      tap(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.token = user.token;
          this.user = user;
          this.currentUserSubject$.next(user);
        }
      })
    );
  }

  logout() {
    this.user = null;
    this.token = null;
    this.currentUserSubject$.next(null);
  }
}
