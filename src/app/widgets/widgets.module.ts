import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectionListDialogComponent } from "./components/selection-list-dialog/selection-list-dialog.component";
import { MaterialModule } from "../material";
import { FormsModule } from "@angular/forms";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [SelectionListDialogComponent, ConfirmationDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule, TranslateModule],
  exports: [SelectionListDialogComponent],
  entryComponents: [SelectionListDialogComponent, ConfirmationDialogComponent]
})
export class WidgetsModule {}
