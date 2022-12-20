import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ExportData } from "../../dto/export-data";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { generate_uuid } from "../../../shared/util/generate_uuid";
import { from } from "rxjs";
import { ExportDataDto } from "../../dto/export-data-dto";

@Component({
  selector: "vpms-export-actor-dialog",
  templateUrl: "./export-dialog.html",
  styleUrls: ["./export-dialog.component.scss"],
})
export class ExportDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ExportData,
    private store: AngularFirestore
  ) {}

  onSubmit(): void {
    this.dialogRef.close();
    window.navigator.clipboard.writeText(this.formGroup.value.copy_link);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      copy_link: [{ value: null, disabled: false }, Validators.required],
    });
    const storeId = generate_uuid(30);
    from(
      this.store.collection(storeId).add({
        actors: this.data.actors.map(actor => actor.toDto()),
        rotations: this.data.rotations.map(rotation => rotation.toDto()),
        current_rotation: this.data.current_rotation,
      } as ExportDataDto)
    ).subscribe(() => {
      this.formGroup.patchValue({ copy_link: `${window.location.href}?store=${storeId}` });
    });
  }
}
