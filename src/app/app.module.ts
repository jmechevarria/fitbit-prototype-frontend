import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";

import { AppComponent } from "./app.component";
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
import { FitbitDataComponent } from "./components/fitbit-data/fitbit-data.component";

import { MatButtonToggleModule } from "@angular/material";
import { InterdayHeartrateTableComponent } from "./components/interday-heartrate-table/interday-heartrate-table.component";
import { IntradayHeartRateComponent } from "./components/intraday-heart-rate/intraday-heart-rate.component";
import { DecisionTreeComponent } from "./components/decision-tree/decision-tree.component";
import { DevicesPanelComponent } from "./components/devices-panel/devices-panel.component";
import { UsersPanelComponent } from "./components/admin/users-panel/users-panel.component";
import { FitbitAccountsPanelComponent } from "./components/admin/fitbit-accounts-panel/fitbit-accounts-panel.component";
import { ClickStopPropagationDirective } from "./directives/click-stop-propagation.directive";
import { WidgetsModule } from "./widgets/widgets.module";
import { SharedModule } from "./shared/shared.module";
import { environment } from "src/environments/environment";

export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.baseURL + environment.i18n, ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    FitbitClientIDFormComponent,
    DashboardComponent,
    LoginComponent,
    AlertComponent,
    AdminComponent,
    RegisterComponent,
    FitbitDataComponent,
    InterdayHeartrateTableComponent,
    IntradayHeartRateComponent,
    DecisionTreeComponent,
    DevicesPanelComponent,
    UsersPanelComponent,
    FitbitAccountsPanelComponent,
    ClickStopPropagationDirective
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: I18nHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    WidgetsModule,
    SharedModule

    // ChartsModule
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
