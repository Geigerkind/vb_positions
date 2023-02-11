import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { FieldComponent } from "./smart-component/field/field.component";
import { FieldRoutingModule } from "./field-routing.module";
import { AddActorDialogComponent } from "./dumb-component/add-actor-dialog/add-actor-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ReactiveFormsModule } from "@angular/forms";
import { DeleteActorDialogComponent } from "./dumb-component/delete-actor-dialog/delete-actor-dialog.component";
import { CommonModule } from "@angular/common";
import { DeleteRotationDialogComponent } from "./dumb-component/delete-rotation-dialog/delete-rotation-dialog.component";
import { AddRotationDialogComponent } from "./dumb-component/add-rotation-dialog/add-rotation-dialog.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ExportDialogComponent } from "./dumb-component/export-dialog/export-dialog.component";
import { ImportDialogComponent } from "./dumb-component/import-dialog/import-dialog.component";
import { CourtComponent } from "./dumb-component/court/court.component";
import { ResetAllDialogComponent } from "./dumb-component/reset-all-dialog/reset-all-dialog.component";
import { EditActorDialogComponent } from "./dumb-component/edit-actor-dialog/edit-actor-dialog.component";
import { PositionFormFieldComponent } from "./dumb-component/position-form-field/position-form-field.component";
import { PlayerRoleFormFieldComponent } from "./dumb-component/player-role-form-field/player-role-form-field.component";
import { EditRotationDialogComponent } from "./dumb-component/edit-rotation-dialog/edit-rotation-dialog.component";
import { CurrentPositionFormFieldComponent } from "./dumb-component/current-position-form-field/current-position-form-field.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@NgModule({
  declarations: [
    FieldComponent,
    CourtComponent,
    AddActorDialogComponent,
    EditActorDialogComponent,
    DeleteActorDialogComponent,
    DeleteRotationDialogComponent,
    EditRotationDialogComponent,
    AddRotationDialogComponent,
    ExportDialogComponent,
    ImportDialogComponent,
    ResetAllDialogComponent,
    PositionFormFieldComponent,
    PlayerRoleFormFieldComponent,
    CurrentPositionFormFieldComponent,
  ],
  imports: [
    FieldRoutingModule,
    SharedModule,
    TranslateModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatButtonToggleModule,
  ],
  exports: [CourtComponent],
})
export class FieldModule {}
