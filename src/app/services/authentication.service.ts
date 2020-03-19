import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { IUser } from "../models/IUser";
import { environment } from "src/environments/environment";
import { User } from "../models/User";
import { JWTToken } from "../models/JWTToken";
import { IError } from "../models/IError";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private _CURRENT_USER = "current-user";
  private _TOKEN = "token";

  private currentUserSubject$: BehaviorSubject<IUser>;
  public currentUser$: Observable<IUser>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject$ = new BehaviorSubject<IUser>(this.currentUser);
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem(this._CURRENT_USER));
  }

  set currentUser(value) {
    localStorage.setItem(this._CURRENT_USER, JSON.stringify(value));
  }

  get token() {
    return JSON.parse(localStorage.getItem(this._TOKEN));
  }

  set token(value) {
    localStorage.setItem(this._TOKEN, JSON.stringify(value));
  }

  get isAuthenticated() {
    return !!this.currentUser;
  }

  login(username: string, password: string) {
    return this.http
      .post<{ user: User; jwtToken: JWTToken }>(`${environment.apiURL}login`, {
        username,
        password
      })
      .pipe(
        tap(response => {
          console.log(response);
          if (response.user && response.jwtToken) {
            // persist user details and jwt token in local storage
            this.currentUser = response.user;
            this.token = response.jwtToken;
            this.currentUserSubject$.next(this.currentUser);
          }
        })
      );
  }

  logout(error?: IError) {
    this.currentUser = null;
    this.token = null;
    this.currentUserSubject$.next(null);
    this.router.navigate(["/login"]);
  }
}
