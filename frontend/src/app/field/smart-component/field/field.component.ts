import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Circle } from "../../shapes/circle";
import { Shape } from "../../shapes/shape";
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
import { fromEvent } from "rxjs";
import { ExportDialogComponent } from "../../dumb-component/export-dialog/export-dialog.component";
import { ImportDialogComponent } from "../../dumb-component/import-dialog/import-dialog.component";
import { Router } from "@angular/router";
import { ActorDto } from "../../dto/actor-dto";

@Component({
  selector: "vpms-field",
  templateUrl: "./field.component.html",
  styleUrls: ["./field.component.scss"],
})
export class FieldComponent implements AfterViewInit {
  private static OUTER_COLOR: string = "#469ABB";
  private static LINE_COLOR: string = "#FFFFFF";
  private static FRONT_FIELD_COLOR: string = "#FF5202";
  private static BACK_FIELD_COLOR: string = "#F8A941";

  private static LOCAL_STORAGE_KEY_ACTORS: string = "actors_storage";
  private static LOCAL_STORAGE_KEY_ROTATIONS: string = "rotations_storage";
  private static LOCAL_STORAGE_KEY_CURRENT_ROTATION: string = "current_rotation_uuid";

  @ViewChild("field", { static: false })
  private fieldElement: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D;

  private draggedShape?: Shape;
  private actors: Actor[] = [];
  public rotations: Rotation[] = [];
  private currentRotationIndex: number = 0;
  public formGroup: FormGroup;

  get rotation(): Rotation {
    return this.rotations[this.currentRotationIndex];
  }

  constructor(private router: Router, private formBuilder: FormBuilder, private matDialog: MatDialog) {
    this.formGroup = this.formBuilder.group({
      current_rotation: [null, Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.context = this.fieldElement.nativeElement.getContext("2d")!;
    this.context.canvas.width = this.context.canvas.getBoundingClientRect().width;
    this.context.canvas.height = this.context.canvas.getBoundingClientRect().height;

    for (const event_mapping of [
      ["touchstart", "mousedown"],
      ["touchmove", "mousemove"],
    ]) {
      this.context.canvas.addEventListener(event_mapping[0], event => {
        const touch = (event as TouchEvent).touches[0];
        this.fieldElement.nativeElement.dispatchEvent(
          new MouseEvent(event_mapping[1], {
            clientX: touch.clientX,
            clientY: touch.clientY,
          })
        );
      });
    }
    this.context.canvas.addEventListener("touchend", () => this.onMouseUp());
    this.context.canvas.addEventListener("touchcancel", () => this.onMouseUp());
    this.fieldElement.nativeElement.addEventListener("mousedown", event => this.onMouseDown(event));
    this.fieldElement.nativeElement.addEventListener("mouseup", () => this.onMouseUp());
    this.fieldElement.nativeElement.addEventListener("mouseleave", () => this.onMouseUp());
    this.fieldElement.nativeElement.addEventListener("mousemove", event => this.onMouseMove(event));

    // Hacky but it works!
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams && searchParams.get("cr") && searchParams.get("a") && searchParams.get("r0")) {
        this.importLink(searchParams);
      } else {
        const rotationDtos = LocalStorageService.retrieve(FieldComponent.LOCAL_STORAGE_KEY_ROTATIONS) as
          | RotationDto[]
          | undefined;
        const actorDtos = LocalStorageService.retrieve(FieldComponent.LOCAL_STORAGE_KEY_ACTORS) as
          | ActorDto[]
          | undefined;
        const current_rotation = LocalStorageService.retrieve(FieldComponent.LOCAL_STORAGE_KEY_CURRENT_ROTATION) as
          | string
          | undefined;
        if (rotationDtos && actorDtos && current_rotation) {
          this.actors = actorDtos.map(dto => Actor.fromDto(dto, this.context));
          this.rotations = rotationDtos.map(dto => Rotation.fromDto(dto));
          this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === current_rotation)!;
          this.actors.forEach(actor => actor.shape.setRotationProperties(this.rotation.UUID, this.rotation.rotation));
        } else {
          this.rotations = [new Rotation(new Position(1), "Default rotation")];
        }
      }

      this.formGroup.patchValue({ current_rotation: this.rotation.UUID });
      this.formGroup.valueChanges.subscribe(value => this.onRotationChanged(value.current_rotation));
      this.render();
    }, 100);

    fromEvent(window, "resize").subscribe(() => this.fixRenderDimensions());
  }

  private fixRenderDimensions(): void {
    this.context.canvas.width = this.context.canvas.getBoundingClientRect().width;
    this.context.canvas.height = this.context.canvas.getBoundingClientRect().height;
    this.render();
  }

  private onRotationChanged(uuid: string): void {
    this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === uuid);
    this.actors.forEach(actor => actor.shape.setRotationProperties(this.rotation.UUID, this.rotation.rotation));
    this.render();
  }

  private onMouseDown(event: MouseEvent): void {
    const x = event.clientX;
    const y = event.clientY;

    for (let i = this.actors.length - 1; i >= 0; --i) {
      const shape = this.actors[i].shape;
      if (shape.isHit(x, y)) {
        this.draggedShape = shape;
        return;
      }
    }
  }

  private onMouseUp(): void {
    this.draggedShape = undefined;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.draggedShape) {
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    this.draggedShape.setPosition(x, y);
    this.render();
  }

  public onAddActorClicked(): void {
    const dialogRef = this.matDialog.open(AddActorDialogComponent, { autoFocus: false });
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
        case PlayerRole.OutsideHitter:
          this.addShape(actor, new Circle(actor, this.context, false));
          break;
        case PlayerRole.OppositeHitter:
          this.addShape(actor, new Circle(actor, this.context, true));
          break;
      }

      this.render();
    });
  }

  private addShape(actor: Actor, shape: Shape): void {
    shape.setRotationProperties(this.rotation.UUID, this.rotation.rotation);
    actor.setShape(shape);
    this.actors.push(actor);
  }

  onDeleteActorClicked(): void {
    const dialogRef = this.matDialog.open(DeleteActorDialogComponent, {
      data: {
        actors: this.actors,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(uuid => {
      if (!uuid) {
        return;
      }
      const index = this.actors.findIndex(actor => actor.UUID === uuid)!;
      this.actors.splice(index, 1);
      this.render();
    });
  }

  onDeleteRotationClicked(): void {
    const dialogRef = this.matDialog.open(DeleteRotationDialogComponent, {
      data: {
        rotations: this.rotations,
      },
      autoFocus: false,
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
        }
        this.currentRotationIndex = 0;
        this.formGroup.patchValue({ current_rotation: this.rotation.UUID });
      }

      this.render();
    });
  }

  onAddRotationClicked(): void {
    const dialogRef = this.matDialog.open(AddRotationDialogComponent, { autoFocus: false });
    dialogRef.afterClosed().subscribe((rotation: Rotation) => {
      if (!rotation) {
        return;
      }

      this.actors.forEach(actor => actor.shape.setRotationProperties(this.rotation.UUID, this.rotation.rotation));
      this.rotations.push(rotation);
      this.currentRotationIndex = this.rotations.length - 1;
      this.formGroup.patchValue({ current_rotation: rotation.UUID });
      this.render();
    });
  }

  onExportClicked(): void {
    this.matDialog.open(ExportDialogComponent, {
      data: {
        export_url: window.location.href,
      },
      autoFocus: false,
    });
  }

  onImportClicked(): void {
    const dialogRef = this.matDialog.open(ImportDialogComponent, { autoFocus: false });
    dialogRef.afterClosed().subscribe((urlSearchParams: URLSearchParams) => this.importLink(urlSearchParams));
  }

  private importLink(urlSearchParams: URLSearchParams): void {
    if (!urlSearchParams || !urlSearchParams.get("cr") || !urlSearchParams.get("a") || !urlSearchParams.get("r0")) {
      return;
    }

    this.actors = JSON.parse(atob(urlSearchParams.get("a")!)).map(actorDto => Actor.fromDto(actorDto, this.context));

    const rotations: Rotation[] = [];
    let i = 0;
    while (urlSearchParams.get("r" + i)) {
      rotations.push(
        // @ts-ignore
        Rotation.fromDto(JSON.parse(atob(urlSearchParams.get("r" + i)!)) as RotationDto, this.context)
      );
      ++i;
    }

    this.rotations = rotations;
    const uuid = urlSearchParams.get("cr")!;
    this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === uuid)!;
    this.formGroup.patchValue({ current_rotation: this.rotation.UUID });
    this.actors.forEach(actor => actor.shape.setRotationProperties(this.rotation.UUID, this.rotation.rotation));

    this.render();
  }

  render(): void {
    this.initCourt();
    this.actors.forEach(actor => actor.draw());

    LocalStorageService.store(
      FieldComponent.LOCAL_STORAGE_KEY_ROTATIONS,
      this.rotations.map(rotation => rotation.toDto())
    );
    LocalStorageService.store(FieldComponent.LOCAL_STORAGE_KEY_CURRENT_ROTATION, this.rotation.UUID);
    LocalStorageService.store(
      FieldComponent.LOCAL_STORAGE_KEY_ACTORS,
      this.actors.map(actor => actor.toDto())
    );
    this.router.navigate(["/"], {
      queryParams: {
        cr: this.rotation.UUID,
        a: btoa(JSON.stringify(this.actors.map(actor => actor.toDto()))),
        ...Object.fromEntries(
          this.rotations.reduce((acc, rotation) => {
            // @ts-ignore
            acc.set("r" + acc.size, btoa(JSON.stringify(rotation.toDto())));
            return acc;
          }, new Map())
        ),
      },
      replaceUrl: true,
      queryParamsHandling: "merge",
    });
  }

  private initCourt(): void {
    const canvasWidth = this.context.canvas.getBoundingClientRect().width;
    const canvasHeight = this.context.canvas.getBoundingClientRect().height;

    this.context.clearRect(0, 0, canvasWidth, canvasHeight);

    // General field color
    this.context.fillStyle = FieldComponent.OUTER_COLOR;
    this.context.fillRect(0, 0, canvasWidth, canvasHeight);

    // Dimensions: 18x9, each side 9x9, of which 3m is the front field
    const OUTSIDE_SPACE_LEFT_AND_RIGHT = canvasWidth * 0.025;
    const OUTSIDE_SPACE_BACK = canvasHeight * 0.025;
    // Including 1m from the opponent team
    const field_height_1m = (canvasHeight - OUTSIDE_SPACE_BACK) / 10;
    const field_width_1m = (canvasWidth - OUTSIDE_SPACE_LEFT_AND_RIGHT * 2) / 9;

    const field_width_start = OUTSIDE_SPACE_LEFT_AND_RIGHT;
    const field_width = canvasWidth - OUTSIDE_SPACE_LEFT_AND_RIGHT * 2;

    // Front field
    this.context.fillStyle = FieldComponent.FRONT_FIELD_COLOR;
    this.context.fillRect(field_width_start, 0, field_width, field_height_1m * 4);

    // Back field
    this.context.fillStyle = FieldComponent.BACK_FIELD_COLOR;
    this.context.fillRect(field_width_start, field_height_1m * 4, field_width, field_height_1m * 6);

    // Lines
    // Must be 5cm wide
    const line_height = field_height_1m / 20;
    const line_width = field_width_1m / 20;

    this.context.fillStyle = FieldComponent.LINE_COLOR;
    // Vertical lines
    this.context.fillRect(field_width_start, 0, line_width, field_height_1m * 10);
    this.context.fillRect(field_width + field_width_start - line_width, 0, line_width, field_height_1m * 10);
    // Horizontal lines
    this.context.fillRect(field_width_start, field_height_1m * 4, field_width, line_height);
    this.context.fillRect(field_width_start, field_height_1m * 10, field_width, line_height);

    // Net line
    this.context.fillRect(field_width_start, field_height_1m * 1 - line_height * 3, field_width, line_height * 3);
  }
}
