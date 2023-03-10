import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";

@Component({
  selector: "vpms-add-attack",
  templateUrl: "./add-attack.component.html",
  styleUrls: ["./add-attack.component.scss"],
})
export class AddAttackComponent {
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, public statisticsService: StatisticsService, private router: Router) {
    this.formGroup = formBuilder.group({
      ballTouch_uuid: null,
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
      touch_count: [null, Validators.required],
      failure_type: [null, Validators.required],
      target_position: null,
    });
  }

  onSubmit(): void {
    const values = this.formGroup.value;
    this.statisticsService.addAttack(
      values.player_uuid,
      values.metadata_uuid,
      values.touch_count,
      values.failure_type,
      values.target_position,
      values.ballTouch_uuid
    );
    this.router.navigate(["/statistics/add_data"]);
  }
}
