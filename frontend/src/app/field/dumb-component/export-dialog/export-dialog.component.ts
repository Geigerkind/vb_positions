import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";

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
    @Inject(MAT_DIALOG_DATA) public data: { export_url: string }
  ) {}

  onSubmit(): void {
    this.dialogRef.close();
    window.navigator.clipboard.writeText(this.data.export_url);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      copy_link: [{ value: this.data.export_url, disabled: true }],
    });
  }
}
