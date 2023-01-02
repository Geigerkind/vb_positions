import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  private currentTeamName?: string = "TODO REMOVE!";

  get teamName(): string | undefined {
    return this.currentTeamName;
  }

  constructor(private angularFirestore: AngularFirestore) {}

  viewTeam(teamName: string): void {
    this.currentTeamName = teamName;
  }

  logout(): void {
    this.currentTeamName = undefined;
  }

  isTeamSet(): boolean {
    return !!this.currentTeamName;
  }
}
