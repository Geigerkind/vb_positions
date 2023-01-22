import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { FailureType } from "../../value/failureType";
import { CourtDialogComponent } from "../../dumb-component/court-dialog/court-dialog.component";

@Component({
  selector: "vpms-add-attack",
  templateUrl: "./add-attack.component.html",
  styleUrls: ["./add-attack.component.scss"],
})
export class AddAttackComponent {
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
    this.statisticsService.addAttack(
      values.player_uuid,
      values.metadata_uuid,
      values.failure_type,
      values.target_position
    );
    this.router.navigate(["/statistics/add_data"]);
  }

  attackFailed(): boolean {
    return this.formGroup.value.failure_type !== FailureType.NONE_TECHNICAL;
  }

  hasTargetPosition(): boolean {
    return !!this.formGroup.value.target_position;
  }

  formatTargetPosition(): string {
    const target_position = this.formGroup.value.target_position;
    return `X: ${target_position[2]}m | Y: ${target_position[3]}m`;
  }
}
