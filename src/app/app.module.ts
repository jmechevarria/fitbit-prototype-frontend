import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { FormsModule } from "@angular/forms";
import { FitbitClientIDFormComponent } from "./fitbit-client-idform/fitbit-client-idform.component";
import { HttpClientModule } from "@angular/common/http";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DatePipe } from "@angular/common";

@NgModule({
  declarations: [AppComponent, FitbitClientIDFormComponent, DashboardComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
