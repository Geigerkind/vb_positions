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
import { AddReceiveComponent } from "./smart-component/add-receive/add-receive.component";
import { AddTossComponent } from "./smart-component/add-toss/add-toss.component";
import { AddAttackComponent } from "./smart-component/add-attack/add-attack.component";
import { AddBlockComponent } from "./smart-component/add-block/add-block.component";
import { ReceivesComponent } from "./smart-component/receives/receives.component";
import { ServesComponent } from "./smart-component/serves/serves.component";
import { TossesComponent } from "./smart-component/tosses/tosses.component";
import { AttacksComponent } from "./smart-component/attacks/attacks.component";
import { BlocksComponent } from "./smart-component/blocks/blocks.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "add_data",
    component: AddDataMenuComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "receives",
    component: ReceivesComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "serves",
    component: ServesComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "tosses",
    component: TossesComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "attacks",
    component: AttacksComponent,
    canActivate: [IsTeamSetGuardService],
  },
  {
    path: "blocks",
    component: BlocksComponent,
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
    path: "add_data/receive",
    component: AddReceiveComponent,
    canActivate: [IsTeamSetGuardService, HasPlayersAndMetadataGuardService],
  },
  {
    path: "add_data/toss",
    component: AddTossComponent,
    canActivate: [IsTeamSetGuardService, HasPlayersAndMetadataGuardService],
  },
  {
    path: "add_data/attack",
    component: AddAttackComponent,
    canActivate: [IsTeamSetGuardService, HasPlayersAndMetadataGuardService],
  },
  {
    path: "add_data/block",
    component: AddBlockComponent,
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
