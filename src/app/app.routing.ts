import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FitbitClientIDFormComponent } from "./components/fitbit-client-idform/fitbit-client-idform.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UserAuthenticationGuard } from "./guards/user-authentication.guard";
import { AdminComponent } from "./components/admin/admin.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginRegisterGuard } from "./guards/login-register.guard";
import { AdminGuard } from "./guards/admin.guard";
import { CaregiverGuard } from "./guards/caregiver.guard";

const routes: Routes = [
  { path: "", component: FitbitClientIDFormComponent },
  { path: "login", component: LoginComponent, canActivate: [LoginRegisterGuard] },
  { path: "register", component: RegisterComponent, canActivate: [LoginRegisterGuard] },
  { path: "admin", component: AdminComponent, canActivate: [UserAuthenticationGuard, AdminGuard] },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [UserAuthenticationGuard, CaregiverGuard]
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
