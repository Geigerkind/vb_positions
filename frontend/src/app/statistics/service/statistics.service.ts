import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Player } from "../entity/player";
import { generate_uuid } from "../../shared/util/generate_uuid";
import { MetaData } from "../entity/metaData";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  private currentTeamName?: string = "TODO REMOVE!";
  private _players: Player[] = [];
  private _metadata: MetaData[] = [];
  private _metadataLookup: Map<string, number> = new Map();

  get teamName(): string | undefined {
    return this.currentTeamName;
  }

  get players(): Player[] {
    return this._players;
  }

  get metadata(): MetaData[] {
    return this._metadata;
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

  addPlayer(player_name: string): void {
    this._players.push({
      uuid: generate_uuid(32),
      name: player_name,
    });
  }

  addMetadata(labels: string[]): void {
    const uuid = this.findAndAddUniqueUUID(this._metadataLookup, this._metadata.length);
    this._metadata.push({
      uuid,
      labels,
    });
  }

  private findAndAddUniqueUUID(lookupTable: Map<string, number>, index: number): string {
    let uuid = generate_uuid(32);
    while (lookupTable.has(uuid)) {
      uuid = generate_uuid(32);
    }
    lookupTable.set(uuid, index);
    return uuid;
  }
}
