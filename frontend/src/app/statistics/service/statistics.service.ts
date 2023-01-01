import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  private currentTeamName?: string;

  get teamName(): string | undefined {
    return this.currentTeamName;
  }

  constructor(private angularFirestore: AngularFirestore) {}

  viewTeam(teamName: string): void {
    this.currentTeamName = teamName;
  }

  isTeamSet(): boolean {
    return !!this.currentTeamName;
  }
}
