import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/services/authentication.service";
import { AlertService } from "src/app/services/alert.service";
import { MyErrorStateMatcher } from "src/app/helpers/error-state-matcher";

@Component({
  selector: "login",
  templateUrl: "login.component.html",
  styleUrls: ["./login.component.scss"]
  // styles
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.queryParams);
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
      // email: ["", [Validators.required, Validators.email]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get formFields() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.formFields.username.value, this.formFields.password.value)
      .pipe(first())
      .subscribe(
        response => {
          // this.router.navigate([this.returnUrl]);
          const roleID = response.authenticatedUser.data.roleID;
          if (roleID === 1) this.router.navigate(["/admin"]);
          else if (roleID === 2) this.router.navigate(["/dashboard"]);
          else this.router.navigate([""]);
        },
        error => {
          this.error = error;
          // this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
