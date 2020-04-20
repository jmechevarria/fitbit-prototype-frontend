import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminGuard } from "./guards/admin.guard";
import { CaregiverGuard } from "./guards/caregiver.guard";
import { NotificationsPanelComponent } from "./components/notifications-panel/notifications-panel.component";
import { ClientAccountFormComponent } from "./components/admin/client-account-form/client-account-form.component";
import { UserFormComponent } from "./components/admin/user-form/user-form.component";
import { MasterGuard } from "./guards/master.guard";
import { GUARDS } from "./helpers/Constants";
import { ProfileComponent } from "./components/profile/profile.component";
import { IncidentsPanelComponent } from "./components/incidents-panel/incidents-panel.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [MasterGuard],
    data: {
      guards: [GUARDS.LoginRegister],
    },
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [MasterGuard],
    data: {
      guards: [GUARDS.AuthenticatedGuard],
    },
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [MasterGuard],
    data: {
      guards: [GUARDS.Admin],
    },
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [CaregiverGuard],
  },
  {
    path: "notifications",
    component: NotificationsPanelComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: "incidents",
    component: IncidentsPanelComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: "client-account/new/:type_id",
    component: ClientAccountFormComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "client-account/edit/:type_id/:id",
    component: ClientAccountFormComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "user/new/:role_id",
    component: UserFormComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "user/edit/:role_id/:id",
    component: UserFormComponent,
    canActivate: [AdminGuard],
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
