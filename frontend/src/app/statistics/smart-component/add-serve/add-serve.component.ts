import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ServeType } from "../../value/serveType";
import { FailureType } from "../../value/failureType";
import { CourtDialogComponent } from "../../dumb-component/court-dialog/court-dialog.component";

@Component({
  selector: "vpms-add-serve",
  templateUrl: "./add-serve.component.html",
  styleUrls: ["./add-serve.component.scss"],
})
export class AddServeComponent {
  ServeType: typeof ServeType = ServeType;
  FailureType: typeof FailureType = FailureType;
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    public statisticsService: StatisticsService,
    private router: Router,
    private matDialog: MatDialog
  ) {
    this.formGroup = formBuilder.group({
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
      serve_type: [null, Validators.required],
      failure_type: [null, Validators.required],
      target_position: null,
    });
    ((this.formGroup.controls as any).failure_type as FormControl).valueChanges.subscribe(failure_type => {
      if (failure_type === FailureType.NONE_TECHNICAL) {
        (this.formGroup.controls as any).target_position.setValidators(Validators.required);
      } else {
        (this.formGroup.controls as any).target_position.setValidators(null);
      }
      (this.formGroup.controls as any).target_position.updateValueAndValidity();
    });
  }

  openCourtDialog(): void {
    const ref = this.matDialog.open(CourtDialogComponent, { panelClass: "full-screen-dialog" });
    ref.afterClosed().subscribe(result => {
      (this.formGroup.controls as any).target_position.setValue(result);
    });
  }

  onSubmit(): void {
    const values = this.formGroup.value;
    this.statisticsService.addServe(
      values.player_uuid,
      values.metadata_uuid,
      values.serve_type,
      values.failure_type,
      values.target_position
    );
    this.router.navigate(["/statistics/add_data"]);
  }

  serveFailed(): boolean {
    return this.formGroup.value.failure_type !== FailureType.NONE_TECHNICAL;
  }

  hasTargetPosition(): boolean {
    return !!this.formGroup.value.target_position;
  }

  formatTargetPosition(): string {
    const target_position = this.formGroup.value.target_position;
    return `X: ${target_position[0]}m | Y: ${target_position[1]}m`;
  }
}
