import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./smart-component/login/login.component";
import { IsTeamNotSetGuardService } from "./guard/isTeamNotSet.guard.service";
import { DashboardComponent } from "./smart-component/dashboard/dashboard.component";
import { IsTeamSetGuardService } from "./guard/isTeamSet.guard.service";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [IsTeamNotSetGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
