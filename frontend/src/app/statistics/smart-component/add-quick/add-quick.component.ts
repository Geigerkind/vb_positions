import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { QuickActionType } from "../../value/quickActionType";

@Component({
  selector: "vpms-add-quick",
  templateUrl: "./add-quick.component.html",
  styleUrls: ["./add-quick.component.scss"],
})
export class AddQuickComponent {
  formGroup: FormGroup;

  QuickActionType: typeof QuickActionType = QuickActionType;

  constructor(formBuilder: FormBuilder, public statisticsService: StatisticsService) {
    this.formGroup = formBuilder.group({
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
    });
  }

  onAction(quick_action_type: QuickActionType): void {
    const values = this.formGroup.value;
    this.statisticsService.addQuick(values.player_uuid, values.metadata_uuid, quick_action_type);
    this.formGroup.patchValue({ player_uuid: null });
  }
}
