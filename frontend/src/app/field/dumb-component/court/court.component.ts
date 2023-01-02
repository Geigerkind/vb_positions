import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from "@angular/core";
import { fromEvent } from "rxjs";
import { ActorShape } from "../../shapes/actor-shape";
import { Line } from "../../shapes/line";
import { CourtMode } from "../../value/court-mode";
import { Volleyball } from "../../shapes/volleyball";

@Component({
  selector: "vpms-court",
  templateUrl: "./court.component.html",
  styleUrls: ["./court.component.scss"],
})
export class CourtComponent implements AfterViewInit, OnChanges {
  private static OUTER_COLOR: string = "#469ABB";
  private static LINE_COLOR: string = "#FFFFFF";
  private static FRONT_FIELD_COLOR: string = "#FF5202";
  private static BACK_FIELD_COLOR: string = "#F8A941";

  @Input() measureMode: boolean = false;
  @Input() actors: ActorShape[] = [];
  @Input() lines: Line[] = [];
  @Input() courtMode: CourtMode = CourtMode.MOVE_ACTOR;
  @Output() onRender = new EventEmitter<void>();
  @Output() onReady = new EventEmitter<CanvasRenderingContext2D>();
  @Output() onLineAdded = new EventEmitter<Line>();
  @Output() onLineErased = new EventEmitter<Line>();
  @Output() volleyballPosition = new EventEmitter<[number, number]>();

  @ViewChild("field", { static: false })
  private fieldElement: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D;
  private draggedShape?: ActorShape;
  private drawnLine?: Line;
  private mouseDown: boolean = false;

  private _volleyball?: Volleyball;

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

    if (this.measureMode) {
      this._volleyball = new Volleyball(this.context);
      this._volleyball.setPosition(this.context.canvas.width / 2, this.context.canvas.height / 2);
    }

    fromEvent(window, "resize").subscribe(() => this.render());

    // Hacky but it works!
    setTimeout(() => this.onReady.emit(this.context), 100);
    setTimeout(() => this.render(), 50);
    setTimeout(() => this.render(), 500);
  }

  ngOnChanges(): void {
    if (!this.context) {
      return;
    }
    this.render();
  }

  private onMouseDown(event: MouseEvent): void {
    const rect = this.context.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.mouseDown = true;

    if (this._volleyball && this._volleyball.isHit(x, y)) {
      this.draggedShape = this._volleyball;
      return;
    }

    if (this.courtMode === CourtMode.MOVE_ACTOR) {
      for (let i = this.actors.length - 1; i >= 0; --i) {
        const shape = this.actors[i];
        if (shape.isHit(x, y)) {
          this.draggedShape = shape;
          return;
        }
      }
    } else if (this.courtMode === CourtMode.DRAW_LINE) {
      this.drawnLine = new Line(this.context);
      this.drawnLine.addPosition(x, y);
    }
  }

  private onMouseUp(): void {
    if (this.drawnLine) {
      this.onLineAdded.emit(this.drawnLine);
    }

    this.draggedShape = undefined;
    this.drawnLine = undefined;
    this.mouseDown = false;
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.context.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.courtMode === CourtMode.ERASE_LINE) {
      if (this.mouseDown) {
        const line = this.lines.find(line => line.isHit(x, y));
        if (!line) {
          return;
        }
        this.onLineErased.emit(line);
      }
    } else {
      if (this.draggedShape) {
        if (this._volleyball) {
          this.emitVolleyballPosition();
        }
        this.draggedShape.setPosition(x, y);
      } else if (this.drawnLine) {
        this.drawnLine.addPosition(x, y);
      } else {
        return;
      }
    }

    this.render();
  }

  render(): void {
    this.context.canvas.width = this.context.canvas.getBoundingClientRect().width;
    this.context.canvas.height = this.context.canvas.getBoundingClientRect().height;

    this.initCourt();
    this.actors.forEach(actor => actor.draw());
    this.lines.forEach(actor => actor.draw());
    if (this.drawnLine) {
      this.drawnLine.draw();
    }
    if (this._volleyball) {
      this._volleyball.draw();
    }

    this.onRender.emit();
  }

  private initCourt(): void {
    const canvasWidth = this.context.canvas.getBoundingClientRect().width;
    const canvasHeight = this.context.canvas.getBoundingClientRect().height;

    this.context.clearRect(0, 0, canvasWidth, canvasHeight);

    // General field color
    this.context.fillStyle = CourtComponent.OUTER_COLOR;
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
    this.context.fillStyle = CourtComponent.FRONT_FIELD_COLOR;
    this.context.fillRect(field_width_start, 0, field_width, field_height_1m * 4);

    // Back field
    this.context.fillStyle = CourtComponent.BACK_FIELD_COLOR;
    this.context.fillRect(field_width_start, field_height_1m * 4, field_width, field_height_1m * 6);

    // Lines
    // Must be 5cm wide
    const line_height = field_height_1m / 20;
    const line_width = field_width_1m / 20;

    this.context.fillStyle = CourtComponent.LINE_COLOR;
    // Vertical lines
    this.context.fillRect(field_width_start, 0, line_width, field_height_1m * 10);
    this.context.fillRect(field_width + field_width_start - line_width, 0, line_width, field_height_1m * 10);
    // Horizontal lines
    this.context.fillRect(field_width_start, field_height_1m * 4, field_width, line_height);
    this.context.fillRect(field_width_start, field_height_1m * 10, field_width, line_height);

    // Net line
    this.context.fillRect(field_width_start, field_height_1m - line_height * 3, field_width, line_height * 3);
  }

  private emitVolleyballPosition(): void {
    if (!this._volleyball) {
      return;
    }

    // When I implemented discrete coords, I forgot to add margin for the outer spaces
    // So I have to convert the coordinates now instead of just dividing by 1000
    const position = this._volleyball.getFieldPosition();
    const outer_space = 9000 * 0.025;
    const enemy_space = 900;
    const new_origin = [outer_space, enemy_space];
    const x_coefficient = (9000 + outer_space * 2) / 9000;
    const y_coefficient = (9000 + outer_space + enemy_space) / 9000;

    this.volleyballPosition.emit([
      Number((((position.x - new_origin[0]) / 1000) * x_coefficient).toFixed(2)),
      Number((((position.y - new_origin[1]) / 1000) * y_coefficient).toFixed(2)),
    ]);
  }
}
