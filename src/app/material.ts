import { NgModule } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
// import { MatNativeDateModule } from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  imports: [
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class MaterialModule {}
