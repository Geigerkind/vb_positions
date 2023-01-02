import { AfterViewInit, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "vpms-add-serve",
  templateUrl: "./add-serve.component.html",
  styleUrls: ["./add-serve.component.scss"],
})
export class AddServeComponent implements AfterViewInit {
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private statisticsService: StatisticsService,
    private router: Router,
    private matDialog: MatDialog
  ) {
    this.formGroup = formBuilder.group({
      player_name: [null, Validators.required],
    });
  }

  ngAfterViewInit(): void {
    // this.matDialog.open(CourtDialogComponent, {panelClass: 'full-screen-dialog'});
  }

  onSubmit(): void {
    this.statisticsService.addPlayer(this.formGroup.value.player_name);
    this.router.navigate(["/statistics/add_data"]);
  }
}
