import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { ReceiveType } from "../../value/receiveType";

@Component({
  selector: "vpms-add-receive",
  templateUrl: "./add-receive.component.html",
  styleUrls: ["./add-receive.component.scss"],
})
export class AddReceiveComponent {
  ReceiveType: typeof ReceiveType = ReceiveType;
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, public statisticsService: StatisticsService, private router: Router) {
    this.formGroup = formBuilder.group({
      ballTouch_uuid: null,
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
      receive_type: [null, Validators.required],
      target_position: null,
    });
  }

  onSubmit(): void {
    const values = this.formGroup.value;
    this.statisticsService.addReceive(
      values.player_uuid,
      values.metadata_uuid,
      values.receive_type,
      values.target_position,
      values.ballTouch_uuid
    );
    this.router.navigate(["/statistics/add_data"]);
  }
}
