import { Component } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";

@Component({
  selector: "vpms-add-data-menu",
  templateUrl: "./addDataMenu.component.html",
  styleUrls: ["./addDataMenu.component.scss"],
})
export class AddDataMenuComponent {
  constructor(public statisticsService: StatisticsService) {}
}
