import { CanActivate, Router, UrlTree } from "@angular/router";
import { Injectable } from "@angular/core";
import { StatisticsService } from "../service/statistics.service";

@Injectable({
  providedIn: "root",
})
export class IsTeamNotSetGuardService implements CanActivate {
  constructor(private statisticsService: StatisticsService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.statisticsService.isTeamSet()) {
      return true;
    }
    return this.router.parseUrl("/statistics/dashboard");
  }
}
