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
      players_source: [],
      players_target: [],
      labels: [],
    });
    this.formGroup.valueChanges.subscribe(values => {
      if (values.players_source) {
        this.statisticsService.setCurrentFilterPlayersSource(values.players_source);
      }
      if (values.players_target) {
        this.statisticsService.setCurrentFilterPlayersTarget(values.players_target);
      }
      if (values.labels) {
        this.statisticsService.setCurrentFilterLabels(values.labels);
      }
      this.onFilterChanged.emit();
    });

    statisticsService.filterLabels.subscribe(labels => {
      (this.formGroup.controls as any).labels.setValue(labels);
    });
    statisticsService.filterPlayersSource.subscribe(players => {
      (this.formGroup.controls as any).players_source.setValue(players.map(p => p.uuid));
    });
    statisticsService.filterPlayersTarget.subscribe(players => {
      (this.formGroup.controls as any).players_target.setValue(players.map(p => p.uuid));
    });
  }
}
