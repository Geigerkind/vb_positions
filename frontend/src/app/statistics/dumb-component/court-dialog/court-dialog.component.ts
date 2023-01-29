import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "vpms-court-dialog",
  templateUrl: "./court-dialog.component.html",
  styleUrls: ["./court-dialog.component.scss"],
})
export class CourtDialogComponent {
  volleyballPosition: [number, number, number, number] = [4725, 5000, 4.5, 4.5];

  constructor(private matDialogRef: MatDialogRef<CourtDialogComponent>) {}

  abort(): void {
    this.matDialogRef.close();
  }

  setPosition(): void {
    this.matDialogRef.close(this.volleyballPosition);
  }

  onVolleyballPositionChanged(position: [number, number, number, number]): void {
    this.volleyballPosition = position;
  }
}
