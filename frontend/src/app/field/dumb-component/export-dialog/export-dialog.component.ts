import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TinyUrl } from "../../service/tiny-url";

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
    private tinyUrl: TinyUrl
  ) {}

  onSubmit(): void {
    this.dialogRef.close();
    window.navigator.clipboard.writeText(this.formGroup.value.copy_link);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      copy_link: [{ value: null, disabled: false }, Validators.required],
    });
    this.tinyUrl.shorten(window.location.href).subscribe(url => this.formGroup.patchValue({ copy_link: url }));
  }
}
