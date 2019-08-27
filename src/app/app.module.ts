import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { FormsModule } from "@angular/forms";
import { FitbitClientIDFormComponent } from "./components/fitbit-client-idform/fitbit-client-idform.component";
import { HttpClientModule } from "@angular/common/http";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DatePipe } from "@angular/common";

import { MaterialModule } from "./material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [AppComponent, FitbitClientIDFormComponent, DashboardComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, BrowserAnimationsModule, MaterialModule, FlexLayoutModule],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
