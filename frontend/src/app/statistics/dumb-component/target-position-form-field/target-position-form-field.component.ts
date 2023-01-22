import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CourtDialogComponent } from "../court-dialog/court-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { FailureType } from "../../value/failureType";

@Component({
  selector: "vpms-target-position-form-field",
  templateUrl: "./target-position-form-field.component.html",
  styleUrls: ["./target-position-form-field.component.scss"],
})
export class TargetPositionFormFieldComponent implements OnInit {
  @Input() hasFailureType: boolean = true;
  @Input() formGroup: FormGroup;

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
    if (this.hasFailureType) {
      ((this.formGroup.controls as any).failure_type as FormControl).valueChanges.subscribe(failure_type => {
        if (failure_type === FailureType.NONE_TECHNICAL) {
          (this.formGroup.controls as any).target_position.setValidators(Validators.required);
        } else {
          (this.formGroup.controls as any).target_position.setValidators(null);
        }
        (this.formGroup.controls as any).target_position.updateValueAndValidity();
      });
    }
  }

  openCourtDialog(): void {
    const ref = this.matDialog.open(CourtDialogComponent, { panelClass: "full-screen-dialog" });
    ref.afterClosed().subscribe(result => {
      (this.formGroup.controls as any).target_position.setValue(result);
    });
  }

  touchFailed(): boolean {
    return this.hasFailureType && this.formGroup.value.failure_type !== FailureType.NONE_TECHNICAL;
  }

  hasTargetPosition(): boolean {
    return !!this.formGroup.value.target_position;
  }

  formatTargetPosition(): string {
    const target_position = this.formGroup.value.target_position;
    return `X: ${target_position[2]}m | Y: ${target_position[3]}m`;
  }
}
