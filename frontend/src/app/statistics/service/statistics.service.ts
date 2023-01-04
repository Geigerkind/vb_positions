import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Player } from "../entity/player";
import { generate_uuid } from "../../shared/util/generate_uuid";
import { Metadata } from "../entity/metadata";
import { ServeType } from "../value/serveType";
import { FailureType } from "../value/failureType";
import { BallTouch } from "../entity/ballTouch";
import { Serve } from "../entity/serve";
import { BallTouchType } from "../value/ballTouchType";
import { TargetPointXY } from "../value/targetPointXY";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  private currentTeamName?: string = "TODO REMOVE!";
  private _players: Player[] = [
    {
      uuid: "UUID",
      name: "Some Player",
    },
  ];

  private _playersLookup: Map<string, number> = new Map([[this._players[0].uuid, 0]]);
  private _metadata: Metadata[] = [
    {
      uuid: "MDATA",
      labels: ["Some", "labels"],
    },
  ];

  private _metadataLookup: Map<string, number> = new Map([[this._metadata[0].uuid, 0]]);
  private _ballTouches: BallTouch[] = [];
  private _ballTouchesLookup: Map<string, number> = new Map();

  private _lastUsedPlayer?: Player;
  private _lastUsedMetadata?: Metadata;

  get lastUsedPlayer(): Player | undefined {
    return this._lastUsedPlayer;
  }

  get lastUsedMetadata(): Metadata | undefined {
    return this._lastUsedMetadata;
  }

  get teamName(): string | undefined {
    return this.currentTeamName;
  }

  get players(): Player[] {
    return this._players;
  }

  get metadata(): Metadata[] {
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

  hasPlayersAndMetadata(): boolean {
    return this._players.length > 0 && this._metadata.length > 0;
  }

  addPlayer(player_name: string): void {
    const uuid = this.findAndAddUniqueUUID(this._playersLookup, this._players.length);
    this._players.push({
      uuid,
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

  addServe(
    player_uuid: string,
    metadata_uuid: string,
    serve_type: ServeType,
    failure_type: FailureType,
    target_position: [number, number] | null
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Serve,
      addedAt: new Date(),
      failureType: failure_type,
      metaData: this.getMetadata(metadata_uuid),
      player: this.getPlayer(player_uuid),
      targetPoint:
        target_position === null
          ? undefined
          : ({
              x: target_position[0],
              y: target_position[1],
            } as TargetPointXY),
    } as Serve);
  }

  private getMetadata(uuid: string): Metadata {
    return this._metadata[this._metadataLookup.get(uuid)!];
  }

  private getPlayer(uuid: string): Player {
    return this._players[this._playersLookup.get(uuid)!];
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
