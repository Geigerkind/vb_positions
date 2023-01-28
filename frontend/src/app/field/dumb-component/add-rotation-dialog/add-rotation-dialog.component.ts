import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Rotation} from "../../entity/rotation";
import {Position} from "../../value/position";

@Component({
  selector: "vpms-add-rotation-dialog",
  templateUrl: "./add-rotation-dialog.html",
  styleUrls: ["./add-rotation-dialog.component.scss"],
})
export class AddRotationDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rotations: Rotation[] }
  ) {
  }

  onSubmit(): void {
    this.dialogRef.close({
      rotation: new Rotation(this.formGroup.value.current_rotation ? new Position(this.formGroup.value.current_rotation) : undefined, this.formGroup.value.rotation_name),
      add_before: this.formGroup.value.add_before,
    });
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      rotation_name: null,
      current_rotation: [1],
      add_before: null,
    });
  }
}
