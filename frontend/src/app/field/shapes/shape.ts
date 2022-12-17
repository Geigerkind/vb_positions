import { Actor } from "../entity/actor";
import { Position } from "../value/position";
import { ShapeDto } from "../dto/shape-dto";
import { ShapeFieldPosition } from "../value/shape-field-position";

export abstract class Shape {
  protected rotationOffset: Position;

  protected fieldPositions: Map<string, ShapeFieldPosition>;
  protected _rotationUUID: string;

  constructor(
    public actor: Actor,
    protected context: CanvasRenderingContext2D,
    field_positions?: Map<string, ShapeFieldPosition>
  ) {
    if (field_positions) {
      this.fieldPositions = field_positions;
    } else {
      this.fieldPositions = new Map();
    }
  }

  toDto(): ShapeDto {
    return {
      f: [...this.fieldPositions.entries()],
    };
  }

  public draw(): void {
    this.drawShape();
    this.drawPosition();
    this.drawActorName();
  }

  public setPosition(x: number, y: number): void {
    this.fieldPositions.set(this._rotationUUID, {
      x_percent: Math.max(0, Math.min(x / this.context.canvas.width, 1)),
      y_percent: Math.max(0, Math.min(y / this.context.canvas.height, 1)),
    });
  }

  public getFieldPosition(): ShapeFieldPosition {
    return this.fieldPositions.get(this._rotationUUID)!;
  }

  public setRotationProperties(rotationUUID: string, rotationPosition: Position): void {
    const prevUUID = this._rotationUUID;
    this._rotationUUID = rotationUUID;
    this.rotationOffset = rotationPosition;

    if (this.fieldPositions.size === 0) {
      this.setPosition(this.context.canvas.width / 2, this.context.canvas.height / 2);
    } else if (!this.fieldPositions.has(rotationUUID)) {
      const prevPosition = this.fieldPositions.get(prevUUID)!;
      this.setPosition(
        this.context.canvas.width * prevPosition.x_percent,
        this.context.canvas.height * prevPosition.y_percent
      );
    }
  }

  public removeRotation(uuid: string): void {
    this.fieldPositions.delete(uuid);
  }

  get x(): number {
    return this.context.canvas.width * this.getFieldPosition().x_percent;
  }

  get y(): number {
    return this.context.canvas.height * this.getFieldPosition().y_percent;
  }

  protected currentPosition(): Position {
    return this.actor.position.rotate(this.rotationOffset);
  }

  abstract drawShape(): void;

  abstract drawPosition(): void;

  abstract drawActorName(): void;

  abstract isHit(clickX: number, clickY: number): boolean;
}
