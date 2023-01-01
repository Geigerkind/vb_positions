import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./dumb-component/home/home.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "field",
    loadChildren: () => import("./../field/field.module").then(m => m.FieldModule),
  },
  {
    path: "statistics",
    loadChildren: () => import("./../statistics/statistics.module").then(m => m.StatisticsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
