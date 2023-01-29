import { Component, OnInit } from "@angular/core";
import { PlayerRole } from "../../value/player-role";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Actor } from "../../entity/actor";
import { Position } from "../../value/position";

@Component({
  selector: "vpms-add-actor-dialog",
  templateUrl: "./add-actor-dialog.html",
  styleUrls: ["./add-actor-dialog.component.scss"],
})
export class AddActorDialogComponent implements OnInit {
  PlayerRole: typeof PlayerRole = PlayerRole;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddActorDialogComponent>) {}

  onSubmit(): void {
    this.dialogRef.close(
      new Actor(
        new Position(this.formGroup.value.position),
        this.formGroup.value.player_role,
        this.formGroup.value.player_name
      )
    );
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      player_name: [null],
      position: [null, Validators.required],
      player_role: [null, Validators.required],
    });
  }
}
