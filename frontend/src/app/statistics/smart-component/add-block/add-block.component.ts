import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { BlockType } from "../../value/blockType";

@Component({
  selector: "vpms-add-block",
  templateUrl: "./add-block.component.html",
  styleUrls: ["./add-block.component.scss"],
})
export class AddBlockComponent {
  formGroup: FormGroup;
  BlockType: typeof BlockType = BlockType;

  constructor(formBuilder: FormBuilder, public statisticsService: StatisticsService, private router: Router) {
    this.formGroup = formBuilder.group({
      ballTouch_uuid: null,
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
      block_type: [null, Validators.required],
      failure_type: [null, Validators.required],
      target_position: null,
    });
  }

  onSubmit(): void {
    const values = this.formGroup.value;
    this.statisticsService.addBlock(
      values.player_uuid,
      values.metadata_uuid,
      values.block_type,
      values.failure_type,
      values.target_position,
      values.ballTouch_uuid
    );
    this.router.navigate(["/statistics/add_data"]);
  }
}
