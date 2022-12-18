import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TinyUrl } from "../../service/tiny-url";

@Component({
  selector: "vpms-import-actor-dialog",
  templateUrl: "./import-dialog.html",
  styleUrls: ["./import-dialog.component.scss"],
})
export class ImportDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ImportDialogComponent>,
    private tinyUrl: TinyUrl
  ) {}

  onSubmit(): void {
    const searchpart = this.formGroup.value.resolved_url.split("?")[1];
    this.dialogRef.close(new URLSearchParams(searchpart));
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      link: [null, Validators.required],
      resolved_url: [null, Validators.required],
    });
    (this.formGroup.controls as any).link.valueChanges.subscribe((value: any) => {
      this.tinyUrl.resolve(value).subscribe(url => (this.formGroup.controls as any).resolved_url.setValue(url));
    });
  }
}
