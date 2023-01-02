import { Component } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: "vpms-add-metadata",
  templateUrl: "./add-metadata.component.html",
  styleUrls: ["./add-metadata.component.scss"],
})
export class AddMetadataComponent {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  labels: string[] = [];

  constructor(private statisticsService: StatisticsService, private router: Router) {}

  onSubmit(): void {
    this.statisticsService.addMetadata(this.labels);
    this.router.navigate(["/statistics/add_data"]);
  }

  add(event: MatChipInputEvent): void {
    if (this.labels.includes(event.value)) {
      return;
    }

    this.labels.push(event.value);
    event.chipInput!.clear();
  }

  remove(index: number): void {
    this.labels.splice(index, 1);
  }
}
