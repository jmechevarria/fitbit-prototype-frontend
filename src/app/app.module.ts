import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// used to create fake backend
import { fakeBackendProvider } from "./helpers";

import { AppComponent } from "./app.component";
// import { routing } from "./app.routing";

import { JwtInterceptor, ErrorInterceptor } from "./helpers";
import { AdminComponent } from "./components/admin/admin.component";
import { LoginComponent } from "./components/login/login.component";
import { AppRoutingModule } from "./app.routing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FitbitClientIDFormComponent } from "./components/fitbit-client-idform/fitbit-client-idform.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DatePipe } from "@angular/common";

import { MaterialModule } from "./material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FlexLayoutModule } from "@angular/flex-layout";
import { AlertComponent } from "./components/alert/alert.component";
import { RegisterComponent } from "./components/register/register.component";

@NgModule({
  declarations: [
    AppComponent,
    FitbitClientIDFormComponent,
    DashboardComponent,
    LoginComponent,
    AlertComponent,
    AdminComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
    // routing
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
