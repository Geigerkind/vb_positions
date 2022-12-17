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
import { Router } from "@angular/router";
import { fromEvent } from "rxjs";

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

  private static LOCAL_STORAGE_KEY: string = "rotations_storage";
  private static LOCAL_STORAGE_KEY_CURRENT_ROTATION: string = "current_rotation_uuid";

  @ViewChild("field", { static: false })
  private fieldElement: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D;

  private draggedShape?: Shape;
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
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get("data") && queryParams.get("current_rotation")) {
        this.rotations = JSON.parse(atob(queryParams.get("data")!)).map(dto => Rotation.fromDto(dto, this.context));
        const uuid = queryParams.get("current_rotation")!;
        this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === uuid)!;
      } else {
        const rotationDtos = LocalStorageService.retrieve(FieldComponent.LOCAL_STORAGE_KEY) as
          | RotationDto[]
          | undefined;
        if (rotationDtos) {
          this.rotations = rotationDtos.map(dto => Rotation.fromDto(dto, this.context));
          const uuid = LocalStorageService.retrieve(FieldComponent.LOCAL_STORAGE_KEY_CURRENT_ROTATION) as string;
          this.currentRotationIndex = this.rotations.findIndex(rotation => rotation.UUID === uuid)!;
        } else {
          this.rotations = [new Rotation([], new Position(1), "Default rotation")];
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
    this.render();
  }

  private onMouseDown(event: MouseEvent): void {
    const x = event.clientX;
    const y = event.clientY;

    for (let i = this.rotation.shapes.length - 1; i >= 0; --i) {
      const shape = this.rotation.shapes[i];
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
    const dialogRef = this.matDialog.open(AddActorDialogComponent);
    dialogRef.afterClosed().subscribe((actor: Actor) => {
      if (!actor) {
        return;
      }

      const centerX = this.context.canvas.getBoundingClientRect().width / 2;
      const centerY = this.context.canvas.getBoundingClientRect().height / 2;

      switch (actor.player_role) {
        case PlayerRole.Setter:
          this.rotation.addShape(new HalfCircle(actor, this.context, centerX, centerY));
          break;
        case PlayerRole.MiddleBlocker:
          this.rotation.addShape(new Triangle(actor, this.context, centerX, centerY, false));
          break;
        case PlayerRole.Libero:
          this.rotation.addShape(new Triangle(actor, this.context, centerX, centerY, true));
          break;
        case PlayerRole.OutsideHitter:
          this.rotation.addShape(new Circle(actor, this.context, centerX, centerY, false));
          break;
        case PlayerRole.OppositeHitter:
          this.rotation.addShape(new Circle(actor, this.context, centerX, centerY, true));
          break;
      }

      this.render();
    });
  }

  onDeleteActorClicked(): void {
    const dialogRef = this.matDialog.open(DeleteActorDialogComponent, {
      data: {
        actors: this.rotation.shapes.map(shape => shape.actor),
      },
    });
    dialogRef.afterClosed().subscribe(uuid => {
      if (!uuid) {
        return;
      }
      this.rotation.removeShapeByActorUUID(uuid);
      this.render();
    });
  }

  onDeleteRotationClicked(): void {
    const dialogRef = this.matDialog.open(DeleteRotationDialogComponent, {
      data: {
        rotations: this.rotations,
      },
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
          this.rotations.push(new Rotation([], new Position(1), "Default rotation"));
        }
        this.currentRotationIndex = 0;
        this.formGroup.patchValue({ current_rotation: this.rotation.UUID });
      }

      this.render();
    });
  }

  onAddRotationClicked(): void {
    const dialogRef = this.matDialog.open(AddRotationDialogComponent);
    dialogRef.afterClosed().subscribe((result: { rotation: Rotation; copy_shapes: boolean }) => {
      if (!result) {
        return;
      }

      if (result.copy_shapes) {
        this.rotation.shapes.forEach(shape => result.rotation.addShape(shape.copy()));
      }
      this.rotations.push(result.rotation);
      this.currentRotationIndex = this.rotations.length - 1;
      this.formGroup.patchValue({ current_rotation: result.rotation.UUID });
      this.render();
    });
  }

  render(): void {
    this.initCourt();
    this.rotation.shapes.forEach(shape => shape.draw());

    LocalStorageService.store(
      FieldComponent.LOCAL_STORAGE_KEY,
      this.rotations.map(rotation => rotation.toDto())
    );
    LocalStorageService.store(FieldComponent.LOCAL_STORAGE_KEY_CURRENT_ROTATION, this.rotation.UUID);
    this.router.navigate(["/"], {
      queryParams: {
        current_rotation: this.rotation.UUID,
        data: btoa(JSON.stringify(this.rotations.map(rotation => rotation.toDto()))),
      },
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
    const OUTSIDE_SPACE_BACK = canvasHeight * 0.15;
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
