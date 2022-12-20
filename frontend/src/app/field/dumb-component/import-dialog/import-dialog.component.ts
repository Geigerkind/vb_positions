import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "vpms-import-actor-dialog",
  templateUrl: "./import-dialog.html",
  styleUrls: ["./import-dialog.component.scss"],
})
export class ImportDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ImportDialogComponent>) {}

  onSubmit(): void {
    const split = this.formGroup.value.link.split("?store=");
    if (split.length < 2) {
      return;
    }
    const storeId = split[split.length - 1];
    this.dialogRef.close(storeId);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      link: [null, Validators.required],
    });
  }
}
