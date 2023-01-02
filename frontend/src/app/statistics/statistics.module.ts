import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { StatisticsRoutingModule } from "./statistics-routing.module";
import { MatDialogModule } from "@angular/material/dialog";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSidenavModule } from "@angular/material/sidenav";
import { LoginComponent } from "./smart-component/login/login.component";
import { DashboardComponent } from "./smart-component/dashboard/dashboard.component";
import { SidebarComponent } from "./smart-component/sidebar/sidebar.component";
import { AddDataMenuComponent } from "./smart-component/addDataMenu/addDataMenu.component";
import { AddPlayerComponent } from "./smart-component/add-player/add-player.component";
import { AddMetadataComponent } from "./smart-component/add-metadata/add-metadata.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatGridListModule } from "@angular/material/grid-list";
import { AddServeComponent } from "./smart-component/add-serve/add-serve.component";
import { CourtDialogComponent } from "./dumb-component/court-dialog/court-dialog.component";
import { FieldModule } from "../field/field.module";

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    AddDataMenuComponent,
    AddPlayerComponent,
    AddMetadataComponent,
    AddServeComponent,
    CourtDialogComponent,
  ],
  imports: [
    StatisticsRoutingModule,
    SharedModule,
    TranslateModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatChipsModule,
    MatGridListModule,
    FieldModule,
  ],
})
export class StatisticsModule {}
