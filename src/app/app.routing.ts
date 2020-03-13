import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UserAuthenticationGuard } from "./guards/user-authentication.guard";
import { AdminComponent } from "./components/admin/admin.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginRegisterGuard } from "./guards/login-register.guard";
import { AdminGuard } from "./guards/admin.guard";
import { CaregiverGuard } from "./guards/caregiver.guard";
import { NotificationsPanelComponent } from "./components/notifications-panel/notifications-panel.component";
import { ClientAccountFormComponent } from "./components/admin/client-account-form/client-account-form.component";
import { UserFormComponent } from "./components/admin/user-form/user-form.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginRegisterGuard]
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [LoginRegisterGuard]
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [CaregiverGuard]
  },
  {
    path: "notifications",
    component: NotificationsPanelComponent,
    canActivate: [UserAuthenticationGuard]
  },
  {
    path: "client-account/new/:type_id",
    component: ClientAccountFormComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "client-account/edit/:type_id/:id",
    component: ClientAccountFormComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "user/new/:role_id",
    component: UserFormComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "user/edit/:role_id/:id",
    component: UserFormComponent,
    canActivate: [AdminGuard]
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
