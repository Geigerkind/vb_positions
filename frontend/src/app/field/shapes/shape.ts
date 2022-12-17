import { Actor } from "../entity/actor";
import { Position } from "../value/position";
import { ShapeDto } from "../dto/shape-dto";

export abstract class Shape {
  protected rotationOffset: Position = new Position(1);
  protected x_percent: number;
  protected y_percent: number;

  constructor(public actor: Actor, protected context: CanvasRenderingContext2D, x: number, y: number) {
    this.setPosition(x, y);
  }

  abstract copy(): Shape;

  abstract toDto(): ShapeDto;

  public draw(): void {
    this.drawShape();
    this.drawPosition();
    this.drawActorName();
  }

  public setPosition(x: number, y: number): void {
    this.x_percent = Math.max(0, Math.min(x / this.context.canvas.width, 1));
    this.y_percent = Math.max(0, Math.min(y / this.context.canvas.height, 1));
  }

  get x(): number {
    return this.context.canvas.width * this.x_percent;
  }

  get y(): number {
    return this.context.canvas.height * this.y_percent;
  }

  public setRotationOffset(position: Position): void {
    this.rotationOffset = position;
  }

  protected currentPosition(): Position {
    return this.actor.position.rotate(this.rotationOffset);
  }

  abstract drawShape(): void;

  abstract drawPosition(): void;

  abstract drawActorName(): void;

  abstract isHit(clickX: number, clickY: number): boolean;
}
