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

@NgModule({
  declarations: [
    FieldComponent,
    AddActorDialogComponent,
    DeleteActorDialogComponent,
    DeleteRotationDialogComponent,
    AddRotationDialogComponent,
    ExportDialogComponent,
    ImportDialogComponent,
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
  ],
})
export class FieldModule {}
