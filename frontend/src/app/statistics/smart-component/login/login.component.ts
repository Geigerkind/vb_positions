import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";

@Component({
  selector: "vpms-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, private statisticsService: StatisticsService, private router: Router) {
    this.formGroup = formBuilder.group({
      team_name: [null, Validators.required],
    });
  }

  onViewStatistics(): void {
    this.statisticsService.viewTeam(this.formGroup.value.team_name);
    this.router.navigate(["/statistics"]);
  }
}
