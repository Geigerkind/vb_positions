import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { TossType } from "../../value/tossType";
import { TossDirection } from "../../value/tossDirection";
import { TossTempo } from "../../value/tossTempo";

@Component({
  selector: "vpms-add-serve",
  templateUrl: "./add-toss.component.html",
  styleUrls: ["./add-toss.component.scss"],
})
export class AddTossComponent {
  TossType: typeof TossType = TossType;
  TossDirection: typeof TossDirection = TossDirection;
  TossTempo: typeof TossTempo = TossTempo;
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, public statisticsService: StatisticsService, private router: Router) {
    this.formGroup = formBuilder.group({
      ballTouch_uuid: null,
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
      touch_count: [null, Validators.required],
      toss_type: [null, Validators.required],
      toss_direction: [null, Validators.required],
      toss_tempo: [null, Validators.required],
      failure_type: [null, Validators.required],
      target_position: null,
    });
  }

  onSubmit(): void {
    const values = this.formGroup.value;
    this.statisticsService.addToss(
      values.player_uuid,
      values.metadata_uuid,
      values.touch_count,
      values.toss_type,
      values.toss_direction,
      values.toss_tempo,
      values.failure_type,
      values.target_position,
      values.ballTouch_uuid
    );
    this.router.navigate(["/statistics/add_data"]);
  }
}
