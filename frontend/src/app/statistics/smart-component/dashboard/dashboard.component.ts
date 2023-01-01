import { Component } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";

@Component({
  selector: "vpms-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  constructor(public statisticsService: StatisticsService) {}
}
