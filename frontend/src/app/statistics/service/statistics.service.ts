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
import { ReceiveStatistics } from "../value/receiveStatistics";
import { ServeStatisticByServeType, ServeStatistics } from "../value/serveStatistics";
import { QuickActionType } from "../value/quickActionType";
import { Quick } from "../entity/Quick";
import { QuickStatistics } from "../value/quickStatistics";
import { TouchCount } from "../value/touchCount";
import { TossDirection } from "../value/tossDirection";
import { TossTempo } from "../value/tossTempo";
import { BlockType } from "../value/blockType";
import { TossStatistics } from "../value/tossStatistics";

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
  private _ballTouchesReverseLookup: Map<string, number> = new Map();

  private _quicks: Quick[] = [];
  private _quicksLookup: Map<string, number> = new Map();

  private _lastUsedPlayer?: Player;
  private _lastUsedMetadata?: Metadata;
  private _filterPlayersSource: Player[] = [];
  private _filterPlayersTarget: Player[] = [];
  private _filterLabels: string[] = [];
  private _filterPlayersTargetSubject: Subject<Player[]> = new ReplaySubject();
  private _filterPlayersSourceSubject: Subject<Player[]> = new ReplaySubject();
  private _filterLabelsSubject: Subject<string[]> = new ReplaySubject();

  private collection: AngularFirestoreCollection<StatisticsStoreData>;
  private document: AngularFirestoreDocument<StatisticsStoreData>;
  private valueChangesSubscription: Subscription;

  private _receiveStatistics$: Subject<ReceiveStatistics[]> = new ReplaySubject();
  private _serveStatistics$: Subject<ServeStatistics[]> = new ReplaySubject();
  private _quickStatistics$: Subject<QuickStatistics[]> = new ReplaySubject();
  private _tossStatistics$: Subject<TossStatistics[]> = new ReplaySubject();

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
    const players_source = searchParams.get("players_source");
    if (players_source) {
      this._filterPlayersSource = this._players.filter(p => players_source.includes(p.uuid));
      this._filterPlayersSourceSubject.next(this._filterPlayersSource);
    }
    const players_target = searchParams.get("players_target");
    if (players_target) {
      this._filterPlayersTarget = this._players.filter(p => players_target.includes(p.uuid));
      this._filterPlayersTargetSubject.next(this._filterPlayersTarget);
    }
    const labels = searchParams.get("labels");
    if (labels) {
      this._filterLabels = labels.split(",");
      this._filterLabelsSubject.next(this._filterLabels);
    }
  }

  get filterPlayersTarget(): Observable<Player[]> {
    this.loadFilterParams();
    return this._filterPlayersTargetSubject.asObservable().pipe(distinctUntilChanged());
  }

  get filterPlayersSource(): Observable<Player[]> {
    this.loadFilterParams();
    return this._filterPlayersSourceSubject.asObservable().pipe(distinctUntilChanged());
  }

  get filterLabels(): Observable<string[]> {
    this.loadFilterParams();
    return this._filterLabelsSubject.asObservable().pipe(distinctUntilChanged());
  }

  get filteredBallTouches(): BallTouch[] {
    const player_uuids_source = this._filterPlayersSource.map(p => p.uuid);
    const player_uuids_target = this._filterPlayersTarget.map(p => p.uuid);
    return this._ballTouches.filter(
      bt =>
        (player_uuids_source.length === 0 || player_uuids_source.includes(bt.playerUuid)) &&
        (player_uuids_target.length === 0 ||
          (this._ballTouchesReverseLookup.has(bt.uuid) &&
            player_uuids_target.includes(
              this._ballTouches[this._ballTouchesReverseLookup.get(bt.uuid)!]!.playerUuid
            ))) &&
        (this._filterLabels.length === 0 ||
          this.getMetadata(bt.metaDataUuid).labels.some(label => this._filterLabels.includes(label)))
    );
  }

  get filteredReceives(): Receive[] {
    return this.filteredBallTouches.filter(bt => bt.touchType === BallTouchType.Receive) as Receive[];
  }

  get filteredServes(): Serve[] {
    return this.filteredBallTouches.filter(bt => bt.touchType === BallTouchType.Serve) as Serve[];
  }

  get filteredTosses(): Toss[] {
    return this.filteredBallTouches.filter(bt => bt.touchType === BallTouchType.Toss) as Toss[];
  }

  get filteredAttacks(): Attack[] {
    return this.filteredBallTouches.filter(bt => bt.touchType === BallTouchType.Attack) as Attack[];
  }

  get filteredBlocks(): Block[] {
    return this.filteredBallTouches.filter(bt => bt.touchType === BallTouchType.Block) as Block[];
  }

  get filteredQuicks(): Quick[] {
    const player_uuids_source = this._filterPlayersSource.map(p => p.uuid);
    return this._quicks.filter(
      quick =>
        (player_uuids_source.length === 0 || player_uuids_source.includes(quick.player_uuid)) &&
        (this._filterLabels.length === 0 ||
          this.getMetadata(quick.metadata_uuid).labels.some(label => this._filterLabels.includes(label)))
    );
  }

  getReceiveStatistics(): Observable<ReceiveStatistics[]> {
    return this._receiveStatistics$.asObservable();
  }

  getServeStatistics(): Observable<ServeStatistics[]> {
    return this._serveStatistics$.asObservable();
  }

  getQuickStatistics(): Observable<QuickStatistics[]> {
    return this._quickStatistics$.asObservable();
  }

  getTossStatistics(): Observable<TossStatistics[]> {
    return this._tossStatistics$.asObservable();
  }

  get _tossStatistics(): TossStatistics[] {
    return [
      ...this.filteredTosses
        .reduce((acc, item) => {
          if (!acc.has(item.playerUuid)) {
            acc.set(item.playerUuid, {
              player_name: this.getPlayer(item.playerUuid).name,
              toss_total: 0,
              toss_set_total: 0,
              success_toss_in_2m: 0,
              success_toss_in_4_5m: 0,
              success_toss_in_more_than_4_5m: 0,
              failed: 0,
              not_connected: 0,
              front_left: 0,
              front_center: 0,
              front_right: 0,
              back_left: 0,
              back_center: 0,
              back_right: 0,
            });
          }

          const statistics = acc.get(item.playerUuid)!;
          ++statistics.toss_total;
          if (item.failureType !== FailureType.NONE_TECHNICAL) {
            ++statistics.failed;
          } else if (!this._ballTouchesReverseLookup.has(item.uuid)) {
            ++statistics.not_connected;
          }

          // Ball from receiver
          if (!!item.ballTouchUuid && !!item.targetPoint && this._ballTouchesReverseLookup.has(item.uuid)) {
            const bt = this.getBallTouch(item.ballTouchUuid) as Receive;
            if (bt.targetPoint) {
              const radius = Math.sqrt(
                (bt.targetPoint.x - 6725) * (bt.targetPoint.x - 6725) +
                  (bt.targetPoint.y - 1000) * (bt.targetPoint.y - 1000)
              );
              const over_net = bt.targetPoint.y < 1000;
              if (radius <= 2250 && !over_net) {
                ++statistics.success_toss_in_2m;
              } else if (radius <= 4612.5 && !over_net) {
                ++statistics.success_toss_in_4_5m;
              } else {
                ++statistics.success_toss_in_more_than_4_5m;
              }
            }
          }

          // Set ball
          if (item.targetPoint) {
            const over_net = item.targetPoint.y < 1000;
            if (!over_net) {
              ++statistics.toss_set_total;
              if (item.targetPoint.y <= 3000) {
                if (item.targetPoint.x >= 225 && item.targetPoint.x < 3225) {
                  ++statistics.front_left;
                } else if (item.targetPoint.x >= 3225 && item.targetPoint.x < 6225) {
                  ++statistics.front_center;
                } else if (item.targetPoint.x >= 6225 && item.targetPoint.x <= 9225) {
                  ++statistics.front_right;
                }
              } else {
                if (item.targetPoint.x >= 225 && item.targetPoint.x < 3225) {
                  ++statistics.back_left;
                } else if (item.targetPoint.x >= 3225 && item.targetPoint.x < 6225) {
                  ++statistics.back_center;
                } else if (item.targetPoint.x >= 6225 && item.targetPoint.x <= 9225) {
                  ++statistics.back_right;
                }
              }
            }
          }

          return acc;
        }, new Map<string, TossStatistics>())
        .values(),
    ];
  }

  get _receiveStatistics(): ReceiveStatistics[] {
    return [
      ...this.filteredReceives
        .reduce((acc, item) => {
          if (!acc.has(item.playerUuid)) {
            acc.set(item.playerUuid, {
              player_name: this.getPlayer(item.playerUuid).name,
              receives_total: 0,
              receives_that_connected: 0,
              receives_2m: 0,
              receives_4_5m: 0,
              receives_more_than_4_5m: 0,
            });
          }
          const playerStatistics = acc.get(item.playerUuid)!;
          ++playerStatistics.receives_total;

          if (item.ballTouchUuid) {
            ++playerStatistics.receives_that_connected;
          }

          const radius = Math.sqrt(
            (item.targetPoint.x - 6725) * (item.targetPoint.x - 6725) +
              (item.targetPoint.y - 1000) * (item.targetPoint.y - 1000)
          );
          const over_net = item.targetPoint.y < 1000;
          if (radius <= 2250 && !over_net) {
            ++playerStatistics.receives_2m;
          } else if (radius <= 4612.5 && !over_net) {
            ++playerStatistics.receives_4_5m;
          } else {
            ++playerStatistics.receives_more_than_4_5m;
          }

          return acc;
        }, new Map<string, ReceiveStatistics>())
        .values(),
    ];
  }

  get _quickStatistics(): QuickStatistics[] {
    return [
      ...this.filteredQuicks
        .reduce((acc, item) => {
          if (!acc.has(item.player_uuid)) {
            acc.set(item.player_uuid, {
              player_name: this.getPlayer(item.player_uuid).name,
              scored: 0,
              failed_attack: 0,
              failed_block: 0,
              failed_position: 0,
              failed_receive: 0,
              failed_serve: 0,
              failed_toss: 0,
            });
          }
          const statistics = acc.get(item.player_uuid)!;
          switch (item.quick_action_type) {
            case QuickActionType.Scored:
              ++statistics.scored;
              break;
            case QuickActionType.FailedServe:
              ++statistics.failed_serve;
              break;
            case QuickActionType.FailedBlock:
              ++statistics.failed_block;
              break;
            case QuickActionType.FailedToss:
              ++statistics.failed_toss;
              break;
            case QuickActionType.FailedAttack:
              ++statistics.failed_attack;
              break;
            case QuickActionType.FailedPosition:
              ++statistics.failed_position;
              break;
            case QuickActionType.FailedReceive:
              ++statistics.failed_receive;
              break;
          }

          return acc;
        }, new Map<string, QuickStatistics>())
        .values(),
    ];
  }

  get _serveStatistics(): ServeStatistics[] {
    return [
      ...this.filteredServes
        .reduce((acc, item) => {
          if (!acc.has(item.playerUuid)) {
            const initByServeType: () => ServeStatisticByServeType = () => ({
              returned: 0,
              success: 0,
              net: 0,
              other: 0,
              out: 0,
              part1: 0,
              part2: 0,
              part3: 0,
              part4: 0,
              part5: 0,
              part6: 0,
            });

            acc.set(item.playerUuid, {
              player_name: this.getPlayer(item.playerUuid).name,
              serves_total: 0,
              underhand: initByServeType(),
              overhand: initByServeType(),
              floater: initByServeType(),
              jump: initByServeType(),
              jump_floater: initByServeType(),
            });
          }

          const serveStatistics = acc.get(item.playerUuid)!;
          ++serveStatistics.serves_total;

          const fillByTypeStatistics: any = (it: Serve, statistics: ServeStatisticByServeType) => {
            if (it.failureType === FailureType.NONE_TECHNICAL) {
              ++statistics.success;
              if (this.ballTouchLeadsToReturn(it)) {
                ++statistics.returned;
              }
            } else if (it.failureType === FailureType.Net) {
              ++statistics.net;
            } else if (it.failureType === FailureType.Out) {
              ++statistics.out;
            } else if (it.failureType === FailureType.Other) {
              ++statistics.other;
            }

            const tp = item.targetPoint;
            if (!tp) {
              return;
            }

            if (tp.y >= 1000 && tp.y <= 4000) {
              if (tp.x >= 225 && tp.x < 3225) {
                ++statistics.part4;
              } else if (tp.x >= 3225 && tp.x < 6225) {
                ++statistics.part3;
              } else if (tp.x >= 6225 && tp.x <= 9225) {
                ++statistics.part2;
              }
            } else if (tp.y > 4000 && tp.y <= 10000) {
              if (tp.x >= 225 && tp.x < 3225) {
                ++statistics.part5;
              } else if (tp.x >= 3225 && tp.x < 6225) {
                ++statistics.part6;
              } else if (tp.x >= 6225 && tp.x <= 9225) {
                ++statistics.part1;
              }
            }
          };

          switch (item.serveType) {
            case ServeType.UNDERHAND:
              fillByTypeStatistics(item, serveStatistics.underhand);
              break;
            case ServeType.OVERHAND:
              fillByTypeStatistics(item, serveStatistics.overhand);
              break;
            case ServeType.FLOATER:
              fillByTypeStatistics(item, serveStatistics.floater);
              break;
            case ServeType.JUMP:
              fillByTypeStatistics(item, serveStatistics.jump);
              break;
            case ServeType.JUMP_FLOATER:
              fillByTypeStatistics(item, serveStatistics.jump_floater);
              break;
          }

          return acc;
        }, new Map<string, ServeStatistics>())
        .values(),
    ];
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

  private ballTouchLeadsToReturn(ballTouch: BallTouch): boolean {
    if (!ballTouch.ballTouchUuid) {
      return false;
    }

    const bt1 = this.getBallTouch(ballTouch.ballTouchUuid);
    if (
      bt1.touchType === BallTouchType.Attack &&
      !!(bt1 as Attack).targetPoint &&
      bt1.touchCount === TouchCount.First_Touch
    ) {
      return true;
    } else if (!bt1.ballTouchUuid) {
      return false;
    }

    const bt2 = this.getBallTouch(bt1.ballTouchUuid);
    if (
      (bt2.touchType === BallTouchType.Attack &&
        !!(bt2 as Attack).targetPoint &&
        bt2.touchCount === TouchCount.Second_Touch) ||
      bt2.touchCount === TouchCount.First_Touch
    ) {
      return true;
    } else if (!bt2.ballTouchUuid) {
      return false;
    }

    const bt3 = this.getBallTouch(bt2.ballTouchUuid);
    if (bt3.touchCount === TouchCount.Third_Touch) {
      return true;
    }

    return false;
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
      this._ballTouchesReverseLookup = new Map<string, number>();
      this._ballTouches = [];
      this._quicksLookup = new Map<string, number>();
      this._quicks = [];
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
      if (statisticsStoreData.ballTouches[i].ballTouchUuid) {
        this._ballTouchesReverseLookup.set(statisticsStoreData.ballTouches[i].ballTouchUuid!, i);
      }
    }

    this._players = statisticsStoreData.players;
    this._metadata = statisticsStoreData.metadata.map(fromMetadataDto);
    this._ballTouches = statisticsStoreData.ballTouches.map(bt => ({
      ...bt,
      addedAt: new Date(bt.addedAt),
      targetPoint: (bt as any).targetPoint === "NULL" ? undefined : (bt as any).targetPoint,
    }));
    this._quicks = statisticsStoreData.quicks;

    this.loadFilterParams();
    this.reloadState();
  }

  private saveToFirestore(): void {
    this.document.set({
      players: this._players,
      metadata: this._metadata.map(fromMetadata),
      ballTouches: this._ballTouches.map(bt => ({
        ...bt,
        addedAt: (bt.addedAt as Date).toISOString(),
        targetPoint: (bt as any).targetPoint ? (bt as any).targetPoint : "NULL",
      })),
      quicks: this._quicks,
    });
    this.reloadState();
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
      queryParams: {
        players_source: this._filterPlayersSource.map(p => p.uuid).join(","),
        players_target: this._filterPlayersTarget.map(p => p.uuid).join(","),
        labels: this._filterLabels.join(","),
      },
      queryParamsHandling: "merge",
    });
    this.location.go(this.serializer.serialize(urlTree));
    this.reloadState();
  }

  setCurrentFilterPlayersSource(player_uuids: string[]): void {
    if (this._filterPlayersSource.map(p => p.uuid).join(",") === player_uuids.join(",")) {
      return;
    }

    this._filterPlayersSource = this._players.filter(player => player_uuids.includes(player.uuid));
    this._filterPlayersSourceSubject.next(this._filterPlayersSource);
    this.setFilterParams();
    this.reloadState();
  }

  setCurrentFilterPlayersTarget(player_uuids: string[]): void {
    if (this._filterPlayersTarget.map(p => p.uuid).join(",") === player_uuids.join(",")) {
      return;
    }

    this._filterPlayersTarget = this._players.filter(player => player_uuids.includes(player.uuid));
    this._filterPlayersTargetSubject.next(this._filterPlayersTarget);
    this.setFilterParams();
    this.reloadState();
  }

  setCurrentFilterLabels(labels: string[]): void {
    if (this._filterLabels.join(",") === labels.join(",")) {
      return;
    }

    this._filterLabels = labels;
    this._filterLabelsSubject.next(this._filterLabels);
    this.setFilterParams();
    this.reloadState();
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

  addQuick(player_uuid: string, metadata_uuid: string, quick_action_type: QuickActionType): void {
    const uuid = this.findAndAddUniqueUUID(this._quicksLookup, this._quicks.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._quicks.push({
      uuid,
      player_uuid,
      metadata_uuid,
      quick_action_type,
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
    if (ballTouch_uuid) {
      this._ballTouchesReverseLookup.set(ballTouch_uuid, this._ballTouches.length);
    }
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Serve,
      touchCount: TouchCount.First_Touch,
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
    touch_count: TouchCount,
    failure_type: FailureType,
    target_position: [number, number, number, number] | null,
    ballTouch_uuid?: string
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouchesLookup.set(uuid, this._ballTouches.length);
    if (ballTouch_uuid) {
      this._ballTouchesReverseLookup.set(ballTouch_uuid, this._ballTouches.length);
    }
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Attack,
      addedAt: new Date(),
      failureType: failure_type,
      metaDataUuid: metadata_uuid,
      playerUuid: player_uuid,
      touchCount: touch_count,
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
    block_type: BlockType,
    failure_type: FailureType,
    target_position: [number, number, number, number] | null,
    ballTouch_uuid?: string
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouchesLookup.set(uuid, this._ballTouches.length);
    if (ballTouch_uuid) {
      this._ballTouchesReverseLookup.set(ballTouch_uuid, this._ballTouches.length);
    }
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Block,
      touchCount: TouchCount.Block_Touch,
      addedAt: new Date(),
      failureType: failure_type,
      metaDataUuid: metadata_uuid,
      playerUuid: player_uuid,
      blockType: block_type,
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
    touch_count: TouchCount,
    toss_type: TossType,
    toss_direction: TossDirection,
    toss_tempo: TossTempo,
    failure_type: FailureType,
    target_position: [number, number, number, number] | null,
    ballTouch_uuid?: string
  ): void {
    const uuid = this.findAndAddUniqueUUID(this._ballTouchesLookup, this._ballTouches.length);
    this._lastUsedPlayer = this.getPlayer(player_uuid);
    this._lastUsedMetadata = this.getMetadata(metadata_uuid);

    this._ballTouchesLookup.set(uuid, this._ballTouches.length);
    if (ballTouch_uuid) {
      this._ballTouchesReverseLookup.set(ballTouch_uuid, this._ballTouches.length);
    }
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Toss,
      addedAt: new Date(),
      metaDataUuid: metadata_uuid,
      playerUuid: player_uuid,
      touchCount: touch_count,
      tossType: toss_type,
      tossDirection: toss_direction,
      tossTempo: toss_tempo,
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
    if (ballTouch_uuid) {
      this._ballTouchesReverseLookup.set(ballTouch_uuid, this._ballTouches.length);
    }
    this._ballTouches.push({
      uuid,
      touchType: BallTouchType.Receive,
      touchCount: TouchCount.First_Touch,
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

  getQuick(uuid: string): Quick {
    return this._quicks[this._quicksLookup.get(uuid)!];
  }

  private findAndAddUniqueUUID(lookupTable: Map<string, number>, index: number): string {
    let uuid = generate_uuid(32);
    while (lookupTable.has(uuid)) {
      uuid = generate_uuid(32);
    }
    lookupTable.set(uuid, index);
    return uuid;
  }

  private reloadState(): void {
    this._receiveStatistics$.next(this._receiveStatistics);
    this._serveStatistics$.next(this._serveStatistics);
    this._quickStatistics$.next(this._quickStatistics);
    this._tossStatistics$.next(this._tossStatistics);
  }
}
