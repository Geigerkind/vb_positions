import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { CourtDialogComponent } from "../../dumb-component/court-dialog/court-dialog.component";
import { ReceiveType } from "../../value/receiveType";

@Component({
  selector: "vpms-add-receive",
  templateUrl: "./add-receive.component.html",
  styleUrls: ["./add-receive.component.scss"],
})
export class AddReceiveComponent {
  ReceiveType: typeof ReceiveType = ReceiveType;
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    public statisticsService: StatisticsService,
    private router: Router,
    private matDialog: MatDialog
  ) {
    this.formGroup = formBuilder.group({
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
      receive_type: [null, Validators.required],
      target_position: null,
    });
  }

  openCourtDialog(): void {
    const ref = this.matDialog.open(CourtDialogComponent, { panelClass: "full-screen-dialog" });
    ref.afterClosed().subscribe(result => {
      (this.formGroup.controls as any).target_position.setValue(result);
    });
  }

  onSubmit(): void {
    const values = this.formGroup.value;
    this.statisticsService.addReceive(
      values.player_uuid,
      values.metadata_uuid,
      values.receive_type,
      values.target_position
    );
    this.router.navigate(["/statistics/add_data"]);
  }

  hasTargetPosition(): boolean {
    return !!this.formGroup.value.target_position;
  }

  formatTargetPosition(): string {
    const target_position = this.formGroup.value.target_position;
    return `X: ${target_position[0]}m | Y: ${target_position[1]}m`;
  }
}
