import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Rotation } from "../../entity/rotation";

@Component({
  selector: "vpms-delete-rotation-dialog",
  templateUrl: "./delete-rotation-dialog.html",
  styleUrls: ["./delete-rotation-dialog.component.scss"],
})
export class DeleteRotationDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeleteRotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rotations: Rotation[] }
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.formGroup.value.rotation);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      rotation: [null, Validators.required],
    });
  }
}
