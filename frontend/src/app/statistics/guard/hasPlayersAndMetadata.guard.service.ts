import { CanActivate, Router, UrlTree } from "@angular/router";
import { Injectable } from "@angular/core";
import { StatisticsService } from "../service/statistics.service";

@Injectable({
  providedIn: "root",
})
export class HasPlayersAndMetadataGuardService implements CanActivate {
  constructor(private statisticsService: StatisticsService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.statisticsService.hasPlayersAndMetadata()) {
      return true;
    }
    return this.router.parseUrl("/statistics/add_data");
  }
}
