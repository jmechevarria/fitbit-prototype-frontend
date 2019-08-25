import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FitbitClientIDFormComponent } from './fitbit-client-idform/fitbit-client-idform.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: FitbitClientIDFormComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
