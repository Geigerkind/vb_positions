import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { Player } from "../entity/player";
import { generate_uuid } from "../../shared/util/generate_uuid";
import { Metadata } from "../entity/metadata";
import { ServeType } from "../value/serveType";
import { FailureType } from "../value/failureType";
import { BallTouch } from "../entity/ballTouch";
import { Serve } from "../entity/serve";
import { BallTouchType } from "../value/ballTouchType";
import { TargetPoint } from "../value/targetPoint";
import { ReceiveType } from "../value/receiveType";
import { Receive } from "../entity/receive";
import { TossType } from "../value/tossType";
import { Toss } from "../entity/toss";
import { Attack } from "../entity/attack";
import { Block } from "../entity/block";
import { StatisticsStoreData } from "../dto/StatisticsStoreData";
import { fromMetadata, fromMetadataDto } from "../dto/MetadataDto";
import { distinctUntilChanged, Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { Router, UrlSerializer } from "@angular/router";
import { Location } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  private currentTeamName?: string;
  private _players: Player[] = [];

  private _playersLookup: Map<string, number> = new Map();
  private _metadata: Metadata[] = [];

  private _metadataLookup: Map<string, number> = new Map();
  private _ballTouches: BallTouch[] = [];
  private _ballTouchesLookup: Map<string, number> = new Map();

  private _lastUsedPlayer?: Player;
  private _lastUsedMetadata?: Metadata;
  private _filterPlayers: Player[] = [];
  private _filterLabels: string[] = [];
  private _filterPlayersSubject: Subject<Player[]> = new ReplaySubject();
  private _filterLabelsSubject: Subject<string[]> = new ReplaySubject();

  private collection: AngularFirestoreCollection<StatisticsStoreData>;
  private document: AngularFirestoreDocument<StatisticsStoreData>;
  private valueChangesSubscription: Subscription;

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

  private loadFilterParams(): void {
    const searchParams = new URLSearchParams(window.location.search);
    const players = searchParams.get("players");
    if (players) {
      this._filterPlayers = this._players.filter(p => players.includes(p.uuid));
      this._filterPlayersSubject.next(this._filterPlayers);
    }
    const labels = searchParams.get("labels");
    if (labels) {
      this._filterLabels = labels.split(",");
      this._filterLabelsSubject.next(this._filterLabels);
    }
  }

  get filterPlayers(): Observable<Player[]> {
    this.loadFilterParams();
    return this._filterPlayersSubject.asObservable().pipe(distinctUntilChanged());
  }

  get filterLabels(): Observable<string[]> {
    this.loadFilterParams();
    return this._filterLabelsSubject.asObservable().pipe(distinctUntilChanged());
  }

  get filteredBallTouches(): BallTouch[] {
    const player_uuids = this._filterPlayers.map(p => p.uuid);
    return this._ballTouches.filter(
      bt =>
        player_uuids.includes(bt.playerUuid) &&
        this.getMetadata(bt.metaDataUuid).labels.some(label => this._filterLabels.includes(label))
    );
  }

  get filteredReceives(): Receive[] {
    return this.filteredBallTouches.filter(bt => bt.touchType === BallTouchType.Receive) as Receive[];
  }

  get labels(): string[] {
    return this.metadata
      .map(m => m.labels)
      .reduce((acc, labels) => {
        for (const label of labels) {
          if (!acc.includes(label)) {
            acc.push(label);
          }
        }
        return acc;
      }, []);
  }

  get previousBallTouches(): BallTouch[] {
    return this._ballTouches.slice(-10);
  }

  constructor(
    private angularFirestore: AngularFirestore,
    private router: Router,
    private location: Location,
    private serializer: UrlSerializer
  ) {
    this.loadQueryParams();
  }

  private getFirestoreName(): string {
    return `statistics/${this.teamName!.replace(" ", "_").replace(":", "_")}`;
  }

  private loadFirestoreData(statisticsStoreData?: StatisticsStoreData): void {
    if (!statisticsStoreData) {
      this._playersLookup = new Map<string, number>();
      this._players = [];
      this._metadataLookup = new Map<string, number>();
      this._metadata = [];
      this._ballTouchesLookup = new Map<string, number>();
      this._ballTouches = [];
      return;
    }

    for (let i = 0; i < statisticsStoreData.players.length; ++i) {
      this._playersLookup.set(statisticsStoreData.players[i].uuid, i);
    }

    for (let i = 0; i < statisticsStoreData.metadata.length; ++i) {
      this._metadataLookup.set(statisticsStoreData.metadata[i].uuid, i);
    }

    for (let i = 0; i < statisticsStoreData.ballTouches.length; ++i) {
      this._ballTouchesLookup.set(statisticsStoreData.ballTouches[i].uuid, i);
    }

    this._players = statisticsStoreData.players;
    this._metadata = statisticsStoreData.metadata.map(fromMetadataDto);
    this._ballTouches = statisticsStoreData.ballTouches.map(bt => ({ ...bt, addedAt: new Date(bt.addedAt) }));

    this.loadFilterParams();
  }

  private saveToFirestore(): void {
    this.document.set({
      players: this._players,
      metadata: this._metadata.map(fromMetadata),
      ballTouches: this._ballTouches.map(bt => ({ ...bt, addedAt: (bt.addedAt as Date).toISOString() })),
    });
  }

  viewTeam(teamName: string): void {
    this.currentTeamName = teamName;

    this.collection = this.angularFirestore.collection("statistics");
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
    this.document = this.angularFirestore.doc<StatisticsStoreData>(this.getFirestoreName());
    this.document.get().subscribe(result => this.loadFirestoreData(result.data()));
    this.valueChangesSubscription = this.document.valueChanges().subscribe(result => this.loadFirestoreData(result));
  }

  logout(): void {
    this.currentTeamName = undefined;
  }

  private loadQueryParams(): void {
    const searchParams = new URLSearchParams(window.location.search);
    const teamName = searchParams.get("team_name");
    if (!teamName || this.teamName === teamName) {
      return;
    }
    this.viewTeam(teamName);
    this.loadFilterParams();
  }

  isTeamSet(): boolean {
    this.loadQueryParams();
    return !!this.currentTeamName;
  }

  hasPlayersAndMetadata(): boolean {
    return this._players.length > 0 && this._metadata.length > 0;
  }

  private setFilterParams(): void {
    const urlTree = this.router.createUrlTree([], {
      queryParams: { players: this._filterPlayers.map(p => p.uuid).join(","), labels: this._filterLabels.join(",") },
      queryParamsHandling: "merge",
    });
    this.location.go(this.serializer.serialize(urlTree));
  }

  setCurrentFilterPlayers(player_uuids: string[]): void {
    if (this._filterPlayers.map(p => p.uuid).join(",") === player_uuids.join(",")) {
      return;
    }

    this._filterPlayers = this._players.filter(player => player_uuids.includes(player.uuid));
    this._filterPlayersSubject.next(this._filterPlayers);
    this.setFilterParams();
  }

  setCurrentFilterLabels(labels: string[]): void {
    if (this._filterLabels.join(",") === labels.join(",")) {
      return;
    }

    this._filterLabels = labels;
    this._filterLabelsSubject.next(this._filterLabels);
    this.setFilterParams();
  }

  addPlayer(player_name: string): void {
    const uuid = this.findAndAddUniqueUUID(this._playersLookup, this._players.length);
    this._players.push({
      uuid,
      name: player_name,
    });
    this.saveToFirestore();
  }

  addMetadata(labels: string[]): void {
    const uuid = this.findAndAddUniqueUUID(this._metadataLookup, this._metadata.length);
    this._metadata.push({
      uuid,
      labels,
    });
    this.saveToFirestore();
  }

  addServe(
    player_uuid: string,
    metadata_uuid: string,
    serve_type: ServeType,
    failure_type: FailureType,
    target_position: [number, number, number, number] | null,
    ballTouch_uuid?: string
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouchesLookup.set(uuid, this._ballTouches.length);
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Serve,
      addedAt: new Date(),
      failureType: failure_type,
      metaDataUuid: metadata_uuid,
      playerUuid: player_uuid,
      serveType: serve_type,
      targetPoint:
        target_position === null
          ? undefined
          : ({
              x: target_position[0],
              y: target_position[1],
            } as TargetPoint),
      ballTouchUuid: ballTouch_uuid,
    } as Serve);
    this.saveToFirestore();
  }

  addAttack(
    player_uuid: string,
    metadata_uuid: string,
    failure_type: FailureType,
    target_position: [number, number, number, number] | null,
    ballTouch_uuid?: string
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouchesLookup.set(uuid, this._ballTouches.length);
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Attack,
      addedAt: new Date(),
      failureType: failure_type,
      metaDataUuid: metadata_uuid,
      playerUuid: player_uuid,
      targetPoint:
        target_position === null
          ? undefined
          : ({
              x: target_position[0],
              y: target_position[1],
            } as TargetPoint),
      ballTouchUuid: ballTouch_uuid,
    } as Attack);
    this.saveToFirestore();
  }

  addBlock(
    player_uuid: string,
    metadata_uuid: string,
    failure_type: FailureType,
    target_position: [number, number, number, number] | null,
    ballTouch_uuid?: string
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouchesLookup.set(uuid, this._ballTouches.length);
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Attack,
      addedAt: new Date(),
      failureType: failure_type,
      metaDataUuid: metadata_uuid,
      playerUuid: player_uuid,
      targetPoint:
        target_position === null
          ? undefined
          : ({
              x: target_position[0],
              y: target_position[1],
            } as TargetPoint),
      ballTouchUuid: ballTouch_uuid,
    } as Block);
    this.saveToFirestore();
  }

  addToss(
    player_uuid: string,
    metadata_uuid: string,
    toss_type: TossType,
    failure_type: FailureType,
    target_position: [number, number, number, number] | null,
    ballTouch_uuid?: string
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouchesLookup.set(uuid, this._ballTouches.length);
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Toss,
      addedAt: new Date(),
      metaDataUuid: metadata_uuid,
      playerUuid: player_uuid,
      tossType: toss_type,
      failureType: failure_type,
      targetPoint:
        target_position === null
          ? undefined
          : ({
              x: target_position[0],
              y: target_position[1],
            } as TargetPoint),
      ballTouchUuid: ballTouch_uuid,
    } as Toss);
    this.saveToFirestore();
  }

  addReceive(
    player_uuid: string,
    metadata_uuid: string,
    receive_type: ReceiveType,
    target_position: [number, number, number, number] | null,
    ballTouch_uuid?: string
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouchesLookup.set(uuid, this._ballTouches.length);
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Receive,
      addedAt: new Date(),
      playerUuid: player_uuid,
      metaDataUuid: metadata_uuid,
      receiveType: receive_type,
      targetPoint:
        target_position === null
          ? undefined
          : ({
              x: target_position[0],
              y: target_position[1],
            } as TargetPoint),
      ballTouchUuid: ballTouch_uuid,
    } as Receive);
    this.saveToFirestore();
  }

  getMetadata(uuid: string): Metadata {
    return this._metadata[this._metadataLookup.get(uuid)!];
  }

  getPlayer(uuid: string): Player {
    return this._players[this._playersLookup.get(uuid)!];
  }

  getBallTouch(uuid: string): BallTouch {
    return this._ballTouches[this._ballTouchesLookup.get(uuid)!];
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
