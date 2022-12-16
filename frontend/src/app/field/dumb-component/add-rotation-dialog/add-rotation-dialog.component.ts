import {Component, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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
    private dialogRef: MatDialogRef<AddRotationDialogComponent>
  ) {

  }

  onSubmit(): void {
    this.dialogRef.close({
      rotation: new Rotation([], new Position(this.formGroup.value.current_rotation), this.formGroup.value.rotation_name),
      copy_shapes: this.formGroup.value.copy_shapes
    });
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      rotation_name: null,
      copy_shapes: true,
      current_rotation: [1, Validators.required]
    });
  }
}
