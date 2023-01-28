import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: "vpms-reset-all-dialog",
  templateUrl: "./reset-all-dialog.html",
  styleUrls: ["./reset-all-dialog.component.scss"],
})
export class ResetAllDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResetAllDialogComponent>,
  ) {
  }
}
