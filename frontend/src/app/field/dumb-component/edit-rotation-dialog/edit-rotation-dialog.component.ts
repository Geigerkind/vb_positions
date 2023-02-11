import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Rotation } from "../../entity/rotation";

@Component({
  selector: "vpms-edit-rotation-dialog",
  templateUrl: "./edit-rotation-dialog.html",
  styleUrls: ["./edit-rotation-dialog.component.scss"],
})
export class EditRotationDialogComponent implements OnInit {
  formGroup: FormGroup;
  currentRotation: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditRotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rotations: Rotation[] }
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.formGroup.value);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      rotation: [null, Validators.required],
      rotation_name: [{ value: null, disabled: true }],
      current_rotation: [{ value: null, disabled: true }],
      set_before: [{ value: null, disabled: true }],
    });

    (this.formGroup.controls as any).rotation.valueChanges.subscribe(UUID => {
      const rotation = this.data.rotations.find(it => it.UUID === UUID)!;
      this.currentRotation = UUID;
      this.formGroup.patchValue({
        rotation_name: rotation.name,
        current_rotation: rotation.rotation?.value,
      });
      (this.formGroup.controls as any).rotation_name.enable();
      (this.formGroup.controls as any).current_rotation.enable();
      (this.formGroup.controls as any).set_before.enable();
      this.formGroup.updateValueAndValidity();
    });
  }
}
