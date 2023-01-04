import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./smart-component/login/login.component";
import { IsTeamNotSetGuardService } from "./guard/isTeamNotSet.guard.service";
import { DashboardComponent } from "./smart-component/dashboard/dashboard.component";
import { IsTeamSetGuardService } from "./guard/isTeamSet.guard.service";
import { AddDataMenuComponent } from "./smart-component/addDataMenu/addDataMenu.component";
import { AddPlayerComponent } from "./smart-component/add-player/add-player.component";
import { AddMetadataComponent } from "./smart-component/add-metadata/add-metadata.component";
import { AddServeComponent } from "./smart-component/add-serve/add-serve.component";
import { HasPlayersAndMetadataGuardService } from "./guard/hasPlayersAndMetadata.guard.service";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "add_data",
    component: AddDataMenuComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "add_data/player",
    component: AddPlayerComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "add_data/metadata",
    component: AddMetadataComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "add_data/serve",
    component: AddServeComponent,
    canActivate: [IsTeamSetGuardService, HasPlayersAndMetadataGuardService],
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
