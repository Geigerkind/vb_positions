import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Rotation } from "../../entity/rotation";
import { Position } from "../../value/position";

@Component({
  selector: "vpms-add-rotation-dialog",
  templateUrl: "./add-rotation-dialog.html",
  styleUrls: ["./add-rotation-dialog.component.scss"],
})
export class AddRotationDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddRotationDialogComponent>) {}

  onSubmit(): void {
    this.dialogRef.close(
      new Rotation(new Position(this.formGroup.value.current_rotation), this.formGroup.value.rotation_name)
    );
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      rotation_name: null,
      current_rotation: [1, Validators.required],
    });
  }
}
