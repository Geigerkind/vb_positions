import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Actor } from "../../entity/actor";

@Component({
  selector: "vpms-edit-actor-dialog",
  templateUrl: "./edit-actor-dialog.html",
  styleUrls: ["./edit-actor-dialog.component.scss"],
})
export class EditActorDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditActorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { actors: Actor[] }
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.formGroup.value);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      actor: [null, Validators.required],
      player_name: [{ value: null, disabled: true }],
      position: [{ value: null, disabled: true }, Validators.required],
      player_role: [{ value: null, disabled: true }, Validators.required],
    });

    (this.formGroup.controls as any).actor.valueChanges.subscribe(UUID => {
      const actor = this.data.actors.find(it => it.UUID === UUID)!;
      this.formGroup.patchValue({
        player_name: actor.player_name,
        position: actor.position.value,
        player_role: actor.player_role,
      });
      (this.formGroup.controls as any).player_name.enable();
      (this.formGroup.controls as any).position.enable();
      (this.formGroup.controls as any).player_role.enable();
      this.formGroup.updateValueAndValidity();
    });
  }
}
