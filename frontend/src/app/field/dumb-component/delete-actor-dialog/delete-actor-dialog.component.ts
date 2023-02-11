import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Actor } from "../../entity/actor";
import { Position } from "../../value/position";

@Component({
  selector: "vpms-delete-actor-dialog",
  templateUrl: "./delete-actor-dialog.html",
  styleUrls: ["./delete-actor-dialog.component.scss"],
})
export class DeleteActorDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteActorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { actors: Actor[]; rotation: Position }
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.formGroup.value.actor);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      actor: [null, Validators.required],
    });
  }
}
