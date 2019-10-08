import { NgModule } from "@angular/core";
import { ChartsModule } from "ng2-charts";

@NgModule({
  imports: [ChartsModule],
  exports: [ChartsModule]
})
export class SharedModule {}
