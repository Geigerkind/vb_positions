import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { FailureType } from "../../value/failureType";
import { TossType } from "../../value/tossType";

@Component({
  selector: "vpms-add-serve",
  templateUrl: "./add-toss.component.html",
  styleUrls: ["./add-toss.component.scss"],
})
export class AddTossComponent {
  TossType: typeof TossType = TossType;
  FailureType: typeof FailureType = FailureType;
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, public statisticsService: StatisticsService, private router: Router) {
    this.formGroup = formBuilder.group({
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
      toss_type: [null, Validators.required],
      failure_type: [null, Validators.required],
      target_position: null,
    });
  }

  onSubmit(): void {
    const values = this.formGroup.value;
    this.statisticsService.addToss(
      values.player_uuid,
      values.metadata_uuid,
      values.toss_type,
      values.failure_type,
      values.target_position
    );
    this.router.navigate(["/statistics/add_data"]);
  }
}
