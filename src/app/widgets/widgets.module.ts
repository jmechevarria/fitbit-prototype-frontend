import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material";
import { FormsModule } from "@angular/forms";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule, TranslateModule],
  entryComponents: [ConfirmationDialogComponent],
})
export class WidgetsModule {}
