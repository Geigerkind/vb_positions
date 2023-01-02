import { Component } from "@angular/core";
import { StatisticsService } from "../../service/statistics.service";
import { Router } from "@angular/router";

@Component({
  selector: "vpms-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  constructor(private statisticsService: StatisticsService, private router: Router) {}

  logout(): void {
    this.statisticsService.logout();
    this.router.navigate(["/"]);
  }
}
