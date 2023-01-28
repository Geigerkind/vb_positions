import { Component } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";

@Component({
  selector: "vpms-quick-statistics",
  templateUrl: "./quick-statistics.component.html",
  styleUrls: ["./quick-statistics.component.scss"],
})
export class QuickStatisticsComponent {
  constructor(public statisticsService: StatisticsService) {}
}
