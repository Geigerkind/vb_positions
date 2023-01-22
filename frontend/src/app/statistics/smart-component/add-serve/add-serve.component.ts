import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { ServeType } from "../../value/serveType";

@Component({
  selector: "vpms-add-serve",
  templateUrl: "./add-serve.component.html",
  styleUrls: ["./add-serve.component.scss"],
})
export class AddServeComponent {
  ServeType: typeof ServeType = ServeType;
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, public statisticsService: StatisticsService, private router: Router) {
    this.formGroup = formBuilder.group({
      player_uuid: [statisticsService.lastUsedPlayer?.uuid, Validators.required],
      metadata_uuid: [statisticsService.lastUsedMetadata?.uuid, Validators.required],
      serve_type: [null, Validators.required],
      failure_type: [null, Validators.required],
      target_position: null,
    });
  }

  onSubmit(): void {
    const values = this.formGroup.value;
    this.statisticsService.addServe(
      values.player_uuid,
      values.metadata_uuid,
      values.serve_type,
      values.failure_type,
      values.target_position
    );
    this.router.navigate(["/statistics/add_data"]);
  }
}
