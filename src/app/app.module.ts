import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";

import { AppComponent } from "./app.component";
import { JwtInterceptor, ErrorInterceptor } from "./helpers";
import { AdminComponent } from "./components/admin/admin.component";
import { LoginComponent } from "./components/login/login.component";
import { AppRoutingModule } from "./app.routing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DatePipe } from "@angular/common";

import { MaterialModule } from "./material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FlexLayoutModule } from "@angular/flex-layout";
import { AlertComponent } from "./components/alert/alert.component";
import { FitbitDataComponent } from "./components/fitbit-data/fitbit-data.component";

import { MatButtonToggleModule } from "@angular/material";
import { DecisionTreeComponent } from "./components/decision-tree/decision-tree.component";
import { DevicesPanelComponent } from "./components/devices-panel/devices-panel.component";
import { UsersPanelComponent } from "./components/admin/users-panel/users-panel.component";
import { ClickEventDirective } from "./directives/click-event.directive";
import { WidgetsModule } from "./widgets/widgets.module";
import { SharedModule } from "./shared/shared.module";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { SubscriptionNotificationService } from "./services/subscription.notification.service";
import { NotificationsDropdownComponent } from "./components/notifications-dropdown/notifications-dropdown.component";
import { ReplaceSubstring } from "./helpers/ReplaceSubstringPipe";
import { MomentPipe } from "./helpers/MomentPipe";
import { RoleNamePipe } from "./helpers/RoleNamePipe";
import { IncidentDetailsDialogComponent } from "./components/incidents-panel/incident_details_dialog/incident-details-dialog.component";
import { ClientAccountsPanelComponent } from "./components/admin/client-accounts-panel/client-accounts-panel.component";
import { ClientAccountFormComponent } from "./components/admin/client-account-form/client-account-form.component";
import { UserFormComponent } from "./components/admin/user-form/user-form.component";
import { AccountTypeNamePipe } from "./helpers/account-type-name.pipe";
import { ProfileComponent } from "./components/profile/profile.component";
import { LinkAccountsDialogComponent } from "./components/admin/users-panel/link-accounts-dialog/link-accounts-dialog.component";
import { IncidentsPanelComponent } from "./components/incidents-panel/incidents-panel.component";
import { SentenceCasePipe } from "./helpers/SentenceCasePipe";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";

import { HighchartsChartModule } from "highcharts-angular";

import { PopoverModule } from "ngx-bootstrap/popover";

export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    environment.baseURL + environment.i18n,
    ".json"
  );
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    AlertComponent,
    AdminComponent,
    FitbitDataComponent,
    DecisionTreeComponent,
    DevicesPanelComponent,
    UsersPanelComponent,
    ClientAccountsPanelComponent,
    ClickEventDirective,
    NotificationsDropdownComponent,
    ReplaceSubstring,
    MomentPipe,
    RoleNamePipe,
    IncidentDetailsDialogComponent,
    ClientAccountFormComponent,
    UserFormComponent,
    AccountTypeNamePipe,
    ProfileComponent,
    LinkAccountsDialogComponent,
    IncidentsPanelComponent,
    SentenceCasePipe,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: I18nHttpLoaderFactory,
        deps: [HttpClient],
      },
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
    SharedModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    HighchartsChartModule,
    PopoverModule.forRoot(),
    // ChartsModule
  ],
  entryComponents: [
    IncidentDetailsDialogComponent,
    LinkAccountsDialogComponent,
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    SubscriptionNotificationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
