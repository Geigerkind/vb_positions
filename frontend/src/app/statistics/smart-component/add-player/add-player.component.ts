import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";

@Component({
  selector: "vpms-add-player",
  templateUrl: "./add-player.component.html",
  styleUrls: ["./add-player.component.scss"],
})
export class AddPlayerComponent {
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, private statisticsService: StatisticsService, private router: Router) {
    this.formGroup = formBuilder.group({
      player_name: [null, Validators.required],
    });
  }

  onSubmit(): void {
    this.statisticsService.addPlayer(this.formGroup.value.player_name);
    this.router.navigate(["/statistics/add_data"]);
  }
}
