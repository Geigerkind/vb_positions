import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FieldComponent } from "./smart-component/field/field.component";

const routes: Routes = [
  {
    path: "",
    component: FieldComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldRoutingModule {}
