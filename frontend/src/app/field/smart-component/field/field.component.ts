import { Component, ViewChild } from "@angular/core";
import { Circle } from "../../shapes/circle";
import { MatDialog } from "@angular/material/dialog";
import { AddActorDialogComponent } from "../../dumb-component/add-actor-dialog/add-actor-dialog.component";
import { Actor } from "../../entity/actor";
import { PlayerRole } from "../../value/player-role";
import { Position } from "../../value/position";
import { HalfCircle } from "../../shapes/half-circle";
import { Triangle } from "../../shapes/triangle";
import { DeleteActorDialogComponent } from "../../dumb-component/delete-actor-dialog/delete-actor-dialog.component";
import { Rotation } from "../../entity/rotation";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DeleteRotationDialogComponent } from "../../dumb-component/delete-rotation-dialog/delete-rotation-dialog.component";
import { AddRotationDialogComponent } from "../../dumb-component/add-rotation-dialog/add-rotation-dialog.component";
import { LocalStorageService } from "../../../shared/service/local-storage.service";
import { RotationDto } from "../../dto/rotation-dto";
import { ExportDialogComponent } from "../../dumb-component/export-dialog/export-dialog.component";
import { ImportDialogComponent } from "../../dumb-component/import-dialog/import-dialog.component";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ExportData } from "../../dto/export-data";
import { ExportDataDto } from "../../dto/export-data-dto";
import { Router } from "@angular/router";
import { ActorShape } from "../../shapes/actor-shape";
import { Line } from "../../shapes/line";
import { CourtMode } from "../../value/court-mode";
import { Square } from "../../shapes/square";
import { CourtComponent } from "../../dumb-component/court/court.component";
import { Device } from "../../../shared/util/device";
import { ResetAllDialogComponent } from "../../dumb-component/reset-all-dialog/reset-all-dialog.component";

@Component({
  selector: "vpms-field",
  templateUrl: "./field.component.html",
  styleUrls: ["./field.component.scss"],
})
export class FieldComponent {
  private static VERSION: number = 2;
  private static LOCAL_STORAGE_KEY_ROTATIONS: string = "rotations_storage_v2";
  private static LOCAL_STORAGE_KEY_CURRENT_ROTATION: string = "current_rotation_uuid_v2";
  private static LOCAL_STORAGE_KEY_VERSION: string = "version";

  @ViewChild("court", { static: false })
  private court: CourtComponent;

  private context: CanvasRenderingContext2D;
  public rotations: Rotation[] = [];
  private currentRotationIndex: number = 0;
  public formGroup: FormGroup;

  CourtMode: typeof CourtMode = CourtMode;
  public courtMode: CourtMode = CourtMode.MOVE_ACTOR;
  private ready: boolean = false;

  public __actorShapes: ActorShape[] = [];
  public __lineShapes: Line[] = [];

  get rotation(): Rotation {
    return this.rotations[this.currentRotationIndex];
  }

  get actorShapes(): ActorShape[] {
    return this.rotation?.actors.map(actor => actor.shape) ?? [];
  }

  get lineShapes(): Line[] {
    return this.rotation?.lines ?? [];
  }

  constructor(
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private store: AngularFirestore,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      current_rotation: [null, Validators.required],
    });
  }

  public onCourtReady(context: CanvasRenderingContext2D): void {
    this.context = context;

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams && searchParams.get("store") && searchParams.get("store")!.length === 30) {
      this.importLink(searchParams.get("store")!);
      this.router.navigate(["/"]);
    } else {
      const rotationDtos = LocalStorageService.retrieve(FieldComponent.LOCAL_STORAGE_KEY_ROTATIONS) as
        | RotationDto[]
        | undefined;
      const current_rotation = LocalStorageService.retrieve(FieldComponent.LOCAL_STORAGE_KEY_CURRENT_ROTATION) as
        | string
        | undefined;
      if (rotationDtos && current_rotation) {
        this.rotations = rotationDtos.map(dto => Rotation.fromDto(dto, this.context));
        this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === current_rotation)!;
      } else {
        this.rotations = [new Rotation(new Position(1), "Default rotation")];
      }
      this.setShapes();
      this.formGroup.patchValue({ current_rotation: this.rotation.UUID });
    }

    this.formGroup.valueChanges.subscribe(value => this.onRotationChanged(value.current_rotation));
    this.ready = true;
  }

  private onRotationChanged(uuid: string): void {
    this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === uuid);
    this.setShapes();
    this.court.render();
  }

  public onAddActorClicked(): void {
    const dialogRef = this.matDialog.open(AddActorDialogComponent, {
      autoFocus: false,
      panelClass: Device.isMobileDevice() ? "full-screen-dialog" : undefined,
    });
    dialogRef.afterClosed().subscribe((actor: Actor) => {
      if (!actor) {
        return;
      }

      switch (actor.player_role) {
        case PlayerRole.Setter:
          this.addShape(actor, new HalfCircle(actor, this.context));
          break;
        case PlayerRole.MiddleBlocker:
          this.addShape(actor, new Triangle(actor, this.context, false));
          break;
        case PlayerRole.Libero:
          this.addShape(actor, new Triangle(actor, this.context, true));
          break;
        case PlayerRole.DefensiveSpecialist:
          this.addShape(actor, new Square(actor, this.context));
          break;
        case PlayerRole.OutsideHitter:
          this.addShape(actor, new Circle(actor, this.context, false));
          break;
        case PlayerRole.OppositeHitter:
          this.addShape(actor, new Circle(actor, this.context, true));
          break;
      }

      this.setShapes();
      this.court.render();
    });
  }

  private addShape(actor: Actor, shape: ActorShape): void {
    shape.setRotationProperties(this.rotation.rotation);
    actor.setShape(shape);
    this.rotation.addActor(actor);
  }

  onDeleteActorClicked(): void {
    const dialogRef = this.matDialog.open(DeleteActorDialogComponent, {
      data: {
        actors: this.rotation.actors,
      },
      autoFocus: false,
      panelClass: Device.isMobileDevice() ? "full-screen-dialog" : undefined,
    });
    dialogRef.afterClosed().subscribe(uuid => {
      if (!uuid) {
        return;
      }
      this.rotation.removeActor(uuid);
      this.setShapes();
      this.court.render();
    });
  }

  onResetAllClicked(): void {
    const dialogRef = this.matDialog.open(ResetAllDialogComponent, {
      autoFocus: false,
      panelClass: Device.isMobileDevice() ? "full-screen-dialog" : undefined,
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (!confirm) {
        return;
      }

      this.rotations = [new Rotation(new Position(1), "Default rotation")];
      this.currentRotationIndex = 0;
      this.formGroup.patchValue({ current_rotation: this.rotation.UUID });
      this.setShapes();
    });
  }

  onDeleteRotationClicked(): void {
    const dialogRef = this.matDialog.open(DeleteRotationDialogComponent, {
      data: {
        rotations: this.rotations,
      },
      autoFocus: false,
      panelClass: Device.isMobileDevice() ? "full-screen-dialog" : undefined,
    });
    dialogRef.afterClosed().subscribe(uuid => {
      if (!uuid) {
        return;
      }

      const currentRotationUUID = this.rotation.UUID;
      const index = this.rotations.findIndex(rotation => rotation.UUID === uuid)!;
      this.rotations.splice(index, 1);

      if (currentRotationUUID === uuid) {
        if (this.rotations.length === 0) {
          this.rotations.push(new Rotation(new Position(1), "Default rotation"));
          this.currentRotationIndex = 0;
        }
      } else {
        this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === currentRotationUUID);
      }
      this.formGroup.patchValue({ current_rotation: this.rotation.UUID });
      this.setShapes();
      this.court.render();
    });
  }

  onAddRotationClicked(): void {
    const dialogRef = this.matDialog.open(AddRotationDialogComponent, {
      autoFocus: false,
      data: {
        rotations: this.rotations,
      },
      panelClass: Device.isMobileDevice() ? "full-screen-dialog" : undefined,
    });
    dialogRef.afterClosed().subscribe((result: { rotation: Rotation; add_before?: string; copy_actors: boolean }) => {
      if (!result) {
        return;
      }

      const prevActors = this.rotation.actors;
      if (result.add_before) {
        const index = this.rotations.findIndex(rot => rot.UUID === result.add_before)!;
        this.rotations.splice(index, 0, result.rotation);
        this.currentRotationIndex = index;
      } else {
        this.rotations.push(result.rotation);
        this.currentRotationIndex = this.rotations.length - 1;
      }

      if (result.copy_actors) {
        prevActors.forEach(actor => {
          const copiedActor = actor.copy();
          copiedActor.shape.setRotationProperties(this.rotation.rotation);
          this.rotation.addActor(copiedActor);
        });
      }

      this.formGroup.patchValue({ current_rotation: result.rotation.UUID });
      this.setShapes();
      this.court.render();
    });
  }

  onExportClicked(): void {
    this.matDialog.open(ExportDialogComponent, {
      autoFocus: false,
      data: {
        version: FieldComponent.VERSION,
        rotations: this.rotations,
        current_rotation: this.rotation.UUID,
      } as ExportData,
      panelClass: Device.isMobileDevice() ? "full-screen-dialog" : undefined,
    });
  }

  onImportClicked(): void {
    const dialogRef = this.matDialog.open(ImportDialogComponent, {
      autoFocus: false,
      panelClass: Device.isMobileDevice() ? "full-screen-dialog" : undefined,
    });
    dialogRef.afterClosed().subscribe((storeId: string) => this.importLink(storeId));
  }

  private importLink(storeId: string): void {
    if (!storeId || storeId.length !== 30) {
      return;
    }

    const collection = this.store.collection("rotations");
    collection
      .doc(storeId)
      .get()
      .subscribe((exportData: any) => {
        const exportDataDto = exportData.data() as ExportDataDto;

        this.rotations = exportDataDto.rotations.map(rotationDto => Rotation.fromDto(rotationDto, this.context));
        const uuid = exportDataDto.current_rotation;
        this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === uuid)!;
        this.formGroup.patchValue({ current_rotation: this.rotation.UUID });
        this.setShapes();

        this.court.render();
      });
  }

  setMoveActorMode(): void {
    this.courtMode = CourtMode.MOVE_ACTOR;
  }

  onToggleDrawMode(): void {
    if (this.courtMode === CourtMode.DRAW_LINE) {
      this.courtMode = CourtMode.MOVE_ACTOR;
    } else {
      this.courtMode = CourtMode.DRAW_LINE;
    }
  }

  onToggleEraseMode(): void {
    if (this.courtMode === CourtMode.ERASE_LINE) {
      this.courtMode = CourtMode.MOVE_ACTOR;
    } else {
      this.courtMode = CourtMode.ERASE_LINE;
    }
  }

  onCourtRender(): void {
    if (!this.ready) {
      return;
    }

    LocalStorageService.store(
      FieldComponent.LOCAL_STORAGE_KEY_ROTATIONS,
      this.rotations.map(rotation => rotation.toDto())
    );
    LocalStorageService.store(FieldComponent.LOCAL_STORAGE_KEY_CURRENT_ROTATION, this.rotation.UUID);
    LocalStorageService.store(FieldComponent.LOCAL_STORAGE_KEY_VERSION, FieldComponent.VERSION);
  }

  onLineAdded(line: Line): void {
    this.rotation.addLine(line);
    this.setShapes();
  }

  onLineErased(line: Line): void {
    this.rotation.removeLine(line);
    this.setShapes();
  }

  private setShapes(): void {
    this.__actorShapes = this.actorShapes;
    this.__lineShapes = this.lineShapes;
  }
}
