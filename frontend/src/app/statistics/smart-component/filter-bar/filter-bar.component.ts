import { Component, EventEmitter, Output } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "vpms-filter-bar",
  templateUrl: "./filter-bar.component.html",
  styleUrls: ["./filter-bar.component.scss"],
})
export class FilterBarComponent {
  @Output() onFilterChanged: EventEmitter<void> = new EventEmitter();

  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, public statisticsService: StatisticsService) {
    this.formGroup = formBuilder.group({
      players: [],
      labels: [],
    });
    this.formGroup.valueChanges.subscribe(values => {
      if (values.players) {
        this.statisticsService.setCurrentFilterPlayers(values.players);
      }
      if (values.labels) {
        this.statisticsService.setCurrentFilterLabels(values.labels);
      }
      this.onFilterChanged.emit();
    });

    statisticsService.filterLabels.subscribe(labels => {
      (this.formGroup.controls as any).labels.setValue(labels);
    });
    statisticsService.filterPlayers.subscribe(players => {
      (this.formGroup.controls as any).players.setValue(players.map(p => p.uuid));
    });
  }
}
