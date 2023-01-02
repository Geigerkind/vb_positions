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
import { AddDataMenuComponent } from "./dumb-component/addDataMenu/addDataMenu.component";

@NgModule({
  declarations: [LoginComponent, DashboardComponent, SidebarComponent, AddDataMenuComponent],
  imports: [
    StatisticsRoutingModule,
    SharedModule,
    TranslateModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatSidenavModule,
  ],
})
export class StatisticsModule {}
