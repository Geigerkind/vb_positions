import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "vpms-export-actor-dialog",
  templateUrl: "./export-dialog.html",
  styleUrls: ["./export-dialog.component.scss"],
})
export class ExportDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ExportDialogComponent>) {}

  onSubmit(): void {
    this.dialogRef.close();
    window.navigator.clipboard.writeText(window.location.href);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      copy_link: [{ value: window.location.href, disabled: true }],
    });
  }
}
